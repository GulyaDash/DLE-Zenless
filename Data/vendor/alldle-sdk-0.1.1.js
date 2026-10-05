"use strict";
var AllDleSDK = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    AllDle: () => AllDle
  });

  // src/AllDle.ts
  var DEFAULT_API_BASE_URL = "https://www.alldle.net/api";
  var DEFAULT_CONNECT_TIMEOUT = 3e3;
  var AllDle = class {
    constructor(options) {
      __publicField(this, "gameSlug");
      __publicField(this, "apiBaseUrl");
      __publicField(this, "connectTimeout");
      __publicField(this, "debug");
      __publicField(this, "session", null);
      this.gameSlug = options.gameSlug;
      this.apiBaseUrl = options.apiBaseUrl ?? DEFAULT_API_BASE_URL;
      this.connectTimeout = options.connectTimeout ?? DEFAULT_CONNECT_TIMEOUT;
      this.debug = options.debug ?? false;
    }
    // ------------------------------------------
    // connect()
    // Listens for the ALLDLE_SESSION postMessage sent by AllDle
    // when the game iframe loads. Returns the session or null.
    // ------------------------------------------
    connect() {
      return new Promise((resolve) => {
        if (window.self === window.top) {
          this.log("Not running inside an iframe \u2014 no session will be received.");
          resolve(null);
          return;
        }
        const timer = setTimeout(() => {
          this.log("connect() timed out \u2014 no ALLDLE_SESSION message received.");
          window.removeEventListener("message", handler);
          resolve(null);
        }, this.connectTimeout);
        const handler = (event) => {
          const expectedOrigin = new URL(this.apiBaseUrl).origin;
          if (event.origin !== expectedOrigin) return;
          const data = event.data;
          if (data?.type !== "ALLDLE_SESSION") return;
          if (data.gameSlug !== this.gameSlug) {
            this.log(`Received session for gameSlug "${data.gameSlug}" but expected "${this.gameSlug}". Ignoring.`);
            return;
          }
          clearTimeout(timer);
          window.removeEventListener("message", handler);
          const session = {
            userId: data.userId,
            displayName: data.displayName,
            avatar: data.avatar,
            isAuthenticated: !!data.userId,
            gameSlug: data.gameSlug,
            token: data.token
          };
          this.session = session;
          this.log("Session received:", session);
          resolve(session);
        };
        window.addEventListener("message", handler);
      });
    }
    // ------------------------------------------
    // getSession()
    // Returns the current session, or null if not connected.
    // ------------------------------------------
    getSession() {
      return this.session;
    }
    // ------------------------------------------
    // isAuthenticated()
    // Quick check: is the current player logged in on AllDle?
    // ------------------------------------------
    isAuthenticated() {
      return this.session?.isAuthenticated ?? false;
    }
    // ------------------------------------------
    // completeMode(mode, data)
    // Call this after a player finishes a mode of your game.
    // Tracks the completion on AllDle.
    //
    // Example:
    //   await alldle.completeMode('classic', { won: true, attempts: 4 });
    // ------------------------------------------
    async completeMode(mode, data) {
      if (!this.session) {
        this.log("completeMode() called before connect() \u2014 no session available. Skipping.");
        return;
      }
      if (window.self === window.top) {
        this.log("completeMode() called outside an iframe \u2014 skipping.");
        return;
      }
      try {
        const requestId = crypto.randomUUID();
        const expectedOrigin = new URL(this.apiBaseUrl).origin;
        const result = await new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            window.removeEventListener("message", handler);
            reject(new Error("completeMode() timed out"));
          }, 5e3);
          const handler = (event) => {
            if (event.origin !== expectedOrigin) return;
            if (event.data?.type !== "ALLDLE_COMPLETE_MODE_RESPONSE") return;
            if (event.data?.requestId !== requestId) return;
            clearTimeout(timer);
            window.removeEventListener("message", handler);
            resolve(event.data);
          };
          window.addEventListener("message", handler);
          window.parent.postMessage({
            type: "ALLDLE_COMPLETE_MODE",
            // Versioned so a future change can be told apart from this one.
            // Absent means version 1, which is every integration shipped so far.
            version: 2,
            requestId,
            mode,
            won: data.won,
            attempts: data.attempts ?? null,
            maxAttempts: data.maxAttempts ?? null,
            score: data.score ?? null,
            resultGrid: data.resultGrid ?? null,
            durationMs: data.durationMs ?? null,
            puzzleId: data.puzzleId ?? null
          }, expectedOrigin);
        });
        if (result.success) {
          this.log(`Mode "${mode}" tracked successfully.`);
        } else {
          this.log(`completeMode() failed: ${result.error ?? "Unknown error"}`);
        }
      } catch (err) {
        this.log("completeMode() error:", err);
      }
    }
    // ------------------------------------------
    // getDailyStatus()
    // Returns the completion status of all modes for today.
    // Useful to show a "Come back tomorrow!" message when all modes are done.
    //
    // Example:
    //   const status = await alldle.getDailyStatus();
    //   if (status?.allModesCompleted) showCompletedBanner();
    // ------------------------------------------
    async getDailyStatus() {
      if (!this.session) {
        this.log("getDailyStatus() called before connect() \u2014 no session available.");
        return null;
      }
      if (window.self === window.top) {
        this.log("getDailyStatus() called outside an iframe \u2014 skipping.");
        return null;
      }
      try {
        const requestId = crypto.randomUUID();
        const expectedOrigin = new URL(this.apiBaseUrl).origin;
        const result = await new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            window.removeEventListener("message", handler);
            reject(new Error("getDailyStatus() timed out"));
          }, 5e3);
          const handler = (event) => {
            if (event.origin !== expectedOrigin) return;
            if (event.data?.type !== "ALLDLE_DAILY_STATUS_RESPONSE") return;
            if (event.data?.requestId !== requestId) return;
            clearTimeout(timer);
            window.removeEventListener("message", handler);
            resolve(event.data);
          };
          window.addEventListener("message", handler);
          window.parent.postMessage({
            type: "ALLDLE_GET_DAILY_STATUS",
            requestId
          }, expectedOrigin);
        });
        if (result.success && result.data) {
          this.log("Daily status:", result.data);
          return result.data;
        }
        this.log(`getDailyStatus() failed: ${result.error ?? "Unknown error"}`);
        return null;
      } catch (err) {
        this.log("getDailyStatus() error:", err);
        return null;
      }
    }
    // ------------------------------------------
    // Private helpers
    // ------------------------------------------
    log(...args) {
      if (this.debug) {
        console.log("[AllDle SDK]", ...args);
      }
    }
  };
  return __toCommonJS(index_exports);
})();
//# sourceMappingURL=index.global.js.map