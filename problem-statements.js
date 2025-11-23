fetch("problem-data.json")
    .then(res => res.json())
    .then(data => {

        const accordion = document.getElementById("accordion");
        const openTrack = document.getElementById("openTrack");

        // TRACK A
        data.trackA.forEach(problem => {
            const item = document.createElement("div");
            item.className = "accordion-item";

            item.innerHTML = `
                <div class="accordion-header">
                    ${problem.id}. ${problem.title}
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
                <div class="accordion-content">
                    <p><strong>Problem:</strong> ${problem.problem}</p>
                    <p><strong>Challenge:</strong> ${problem.challenge}</p>
                    <ul class="feature-list">
                        ${problem.features.map(f => `<li>${f}</li>`).join("")}
                    </ul>
                </div>
            `;

            accordion.appendChild(item);
        });

        // Open on click
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const parent = header.parentElement;

                document.querySelectorAll('.accordion-item')
                    .forEach(item => {
                        if(item !== parent) item.classList.remove('active');
                    });

                parent.classList.toggle('active');
            });
        });

        // TRACK B
        openTrack.innerHTML = `
            <div class="open-card">
                <h3>${data.trackB.title}</h3>
                <p>${data.trackB.description}</p>
                <h4>Requirements:</h4>
                <ul>
                    ${data.trackB.requirements.map(r => `<li>${r}</li>`).join("")}
                </ul>
            </div>
        `;
    });
