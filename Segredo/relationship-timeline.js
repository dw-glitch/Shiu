// Timeline animada do relacionamento

class RelationshipTimeline {
    constructor() {
        // Eventos importantes do relacionamento com as datas específicas fornecidas
        this.events = [
            {
                date: "29 de Agosto, 2023",
                title: "Dia Da Escada, 1° Beijo",
                description: "Nosso primeiro beijo na escada, às 19:13h. Um momento mágico que marcou o início de tudo.",
                icon: "fa-kiss",
                time: "19:13"
            },
            {
                date: "12 de Setembro, 2023",
                title: "Dia Da Escada PT2",
                description: "Nossa segunda vez especial na escada. Os momentos ali se tornaram cada vez mais significativos.",
                icon: "fa-heart",
                time: ""
            },
            {
                date: "14 de Setembro, 2023",
                title: "Dia do possível \"Sim\"",
                description: "O momento em que começamos a entender que isso era algo realmente especial, às 16:37h.",
                icon: "fa-comment-heart",
                time: "16:37"
            },
            {
                date: "20 de Setembro, 2023",
                title: "Beco do amor",
                description: "Um lugar que ficará para sempre em nossas memórias, onde nosso amor floresceu ainda mais.",
                icon: "fa-map-marker-alt",
                time: ""
            },
            {
                date: "21 de Setembro, 2023",
                title: "Camboa",
                description: "Um dia especial em um lugar que se tornou parte da nossa história de amor.",
                icon: "fa-tree",
                time: ""
            },
            {
                date: "19 de Outubro, 2023",
                title: "Pedido de Namoro",
                description: "Na escada do posto de gasolina, às 20:43h, quando oficialmente começamos nossa jornada juntos.",
                icon: "fa-ring",
                time: "20:43"
            },
            {
                date: "11 de Dezembro, 2023",
                title: "Dd1°T",
                description: "Um momento íntimo e especial que fortaleceu ainda mais nossa conexão.",
                icon: "fa-fire",
                time: ""
            }
        ];
    }
    
    init() {
        this.createEnhancedTimeline();
        this.setupScrollAnimation();
    }
    
    createEnhancedTimeline() {
        const timelineSection = document.querySelector('.relationship-timeline');
        if (!timelineSection) return;
        
        // Limpar o conteúdo existente
        timelineSection.innerHTML = `
            <h3>Nossa História de Amor</h3>
            <div class="enhanced-timeline">
                <div class="timeline-line"></div>
                ${this.events.map((event, index) => this.createEventElement(event, index)).join('')}
            </div>
        `;
    }
    
    createEventElement(event, index) {
        const isEven = index % 2 === 0;
        const timeInfo = event.time ? `<span class="timeline-time"><i class="fas fa-clock"></i> ${event.time}</span>` : '';
        
        return `
            <div class="timeline-event ${isEven ? 'left' : 'right'}" data-index="${index}">
                <div class="timeline-dot">
                    <i class="fas ${event.icon}"></i>
                </div>
                <div class="timeline-content">
                    <div class="timeline-date">${event.date} ${timeInfo}</div>
                    <h4 class="timeline-title">${event.title}</h4>
                    <p class="timeline-description">${event.description}</p>
                </div>
            </div>
        `;
    }
    
    setupScrollAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        document.querySelectorAll('.timeline-event').forEach(event => {
            observer.observe(event);
        });
    }
}

// Initialize the timeline when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    const timeline = new RelationshipTimeline();
    setTimeout(() => {
        timeline.init();
    }, 1000); // Small delay to ensure other elements are loaded
});
