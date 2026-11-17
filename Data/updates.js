const releaseNotes = [{
    version: "A_00_01",
    agents: [
        {
            name: "Phoenix Reffaella",
            labels: {
                en: ["Human", "S Rank", "Anomaly", "Fire", "Slash", "Krampus", "Kusarikku", "Feather"],
                ru: ["Человек", "Ранг S", "Аномалия", "Огонь", "Режущий", "Крампус", "Kusarikku", "Feather"]
            }
        },
        {
            name: "Severian Lowell",
            labels: {
                en: ["Thiren", "S Rank", "Attack", "Wind", "Slash", "Metropolitan Order Division", "Girtablullu", "Imitation Core"],
                ru: ["Тирен", "Ранг S", "Нападение", "Ветер", "Режущий", "Metropolitan Order Division", "Girtablullu", "Imitation Core"]
            }
        }
    ],
    modes: [
        {
            en: "Added Locations under Other.",
            ru: "Режим «Локации» добавлен в раздел «Другое»."
        },
        {
            en: "Moved Bangboo from the main navigation to Other.",
            ru: "Режим «Банбу» перенесён из главной навигации в раздел «Другое»."
        }
    ]
}];

function renderReleaseNotes() {
    const language = document.documentElement.lang === "ru" ? "ru" : "en";
    const content = document.querySelector("#updatesContent");
    const traits = [
        ["race", races], ["rank", rankImages], ["specialty", specialtyImages],
        ["attribute", attributeImages], ["attackType", attackTypeImages], ["faction", factionImages],
        ["weeklyBoss", weeklyBoss], ["material", materials]
    ];
    document.querySelector("#updatesDialogTitle").textContent = releaseNotes[0].version;
    content.replaceChildren();
    for (const release of releaseNotes) {
        const section = document.createElement("section");
        if (release !== releaseNotes[0]) {
            const version = document.createElement("h3");
            version.textContent = release.version;
            section.append(version);
        }
        for (const entry of release.agents) {
            const agent = agents.find(candidate => candidate.name === entry.name);
            if (!agent) continue;
            const card = document.createElement("article");
            card.className = "update-agent";
            const portrait = document.createElement("img");
            portrait.className = "update-agent-portrait";
            portrait.src = agent.image;
            portrait.alt = "";
            const details = document.createElement("div");
            const name = document.createElement("h3");
            name.textContent = agent.name;
            const icons = document.createElement("ul");
            icons.className = "update-traits";
            traits.forEach(([field, images], index) => {
                const item = document.createElement("li");
                const icon = document.createElement("img");
                icon.src = images[agent[field]];
                icon.alt = entry.labels[language][index];
                item.title = icon.alt;
                item.append(icon);
                icons.append(item);
            });
            details.append(name, icons);
            card.append(portrait, details);
            section.append(card);
        }
        if (release.modes.length) {
            const changes = document.createElement("div");
            changes.className = "update-modes";
            const title = document.createElement("h3");
            title.textContent = language === "ru" ? "Режимы" : "Game modes";
            const list = document.createElement("ul");
            for (const change of release.modes) {
                const item = document.createElement("li");
                item.textContent = change[language];
                list.append(item);
            }
            changes.append(title, list);
            section.append(changes);
        }
        content.append(section);
    }
}
