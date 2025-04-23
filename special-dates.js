// Sistema de contagem regressiva para datas especiais

class SpecialDates {
    constructor() {
        // Adicione aqui suas datas especiais (formato: AAAA-MM-DD)
        this.dates = [
            {
                title: "Próximo Aniversário de Namoro",
                date: "2024-11-19", // Ajuste para 1 mês após a data de namoro (19/10)
                icon: "fa-heart"
            },
            {
                title: "Natal Juntos",
                date: "2024-12-25",
                icon: "fa-gifts"
            },
            {
                title: "Ano Novo Juntos",
                date: "2025-01-01",
                icon: "fa-glass-cheers"
            }
            // Adicione mais datas conforme necessário
        ];
        
        this.container = null;
    }
    
    init() {
        this.createCountdownContainer();
        this.updateCountdowns();
        
        // Atualizar contagens a cada minuto
        setInterval(() => this.updateCountdowns(), 60000);
    }
    
    createCountdownContainer() {
        // Criar container para as contagens regressivas
        const container = document.createElement('div');
        container.className = 'special-dates-container';
        
        // Adicionar título
        container.innerHTML = `
            <h3 class="special-dates-title">
                <i class="fas fa-calendar-heart"></i>
                Próximas Datas Especiais
            </h3>
            <div class="special-dates-list"></div>
        `;
        
        // Adicionar ao tab de futuro
        const futuroTab = document.getElementById('futuro');
        if (futuroTab) {
            // Inserir após a seção de contagem de tempo
            const countdown = futuroTab.querySelector('.countdown');
            if (countdown) {
                countdown.parentNode.insertBefore(container, countdown.nextSibling);
            } else {
                futuroTab.appendChild(container);
            }
        }
        
        this.container = container.querySelector('.special-dates-list');
    }
    
    updateCountdowns() {
        if (!this.container) return;
        
        this.container.innerHTML = '';
        const now = new Date();
        
        // Filtrar e ordenar datas futuras
        const futureDates = this.dates
            .filter(dateObj => new Date(dateObj.date) > now)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Mostrar apenas as próximas 3 datas
        futureDates.slice(0, 3).forEach(dateObj => {
            const eventDate = new Date(dateObj.date);
            const daysLeft = this.getDaysLeft(eventDate);
            
            const dateElement = document.createElement('div');
            dateElement.className = 'special-date-item';
            
            dateElement.innerHTML = `
                <div class="special-date-icon">
                    <i class="fas ${dateObj.icon}"></i>
                </div>
                <div class="special-date-info">
                    <div class="special-date-title">${dateObj.title}</div>
                    <div class="special-date-date">
                        ${eventDate.toLocaleDateString('pt-BR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </div>
                </div>
                <div class="special-date-countdown${daysLeft <= 7 ? ' soon' : ''}">
                    ${this.formatDaysLeft(daysLeft)}
                </div>
            `;
            
            this.container.appendChild(dateElement);
        });
        
        // Se não houver datas futuras
        if (futureDates.length === 0) {
            this.container.innerHTML = `
                <div class="no-special-dates">
                    <i class="fas fa-calendar-day"></i>
                    <p>Nenhuma data especial próxima.</p>
                </div>
            `;
        }
    }
    
    getDaysLeft(date) {
        const now = new Date();
        const diffTime = Math.abs(date - now);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    formatDaysLeft(days) {
        if (days === 0) return "Hoje!";
        if (days === 1) return "Amanhã!";
        return `Faltam ${days} dias`;
    }
}

// Exportar para uso global
window.SpecialDates = SpecialDates;
