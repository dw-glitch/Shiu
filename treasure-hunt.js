// Sistema de Caça ao Tesouro - Com elementos surpresa ao final

class TreasureHunt {
    constructor() {
        this.treasures = [
            {
                id: 'treasure-1',
                icon: 'fa-music',
                hint: 'Encontre onde nossa música toca...',
                message: 'Talvez eu nunca consiga voar como as pétalas de flor por aí. A incerteza que me rodeava antes de te conhecer, sem saber se realmente voltaria a ser o vinicio que sempre fui um dia... ',
                found: false,
                element: null,
                placement: '.our-song'
            },
            {
                id: 'treasure-2',
                icon: 'fa-history',
                hint: 'Procure onde nossa história começou...',
                message: 'Eu sinto sua falta, dizer isso me faz sentir ainda mais sua falta. Naquele momento foi um dos mais agustiantes da minha vida, ali eu percebi que nao vivo sem você. ',
                found: false,
                element: null,
                placement: '.relationship-timeline'
            },
            {
                id: 'treasure-3',
                icon: 'fa-camera',
                hint: 'Olhe para nossas memórias congeladas no tempo...',
                message: 'Escute, meu meu bem, estou voando alto no céu. Ao viver esses momentos com você eu me sentia nas nuvens como se tivesse encontrado o sentido para minha vida. ',
                found: false,
                element: null,
                placement: '.gallery',
                xiumin: true
            },
            {
                id: 'treasure-4',
                icon: 'fa-quote-right',
                hint: 'Onde palavras de amor são compartilhadas...',
                message: 'Desde o momento em que te conheci, minha vida foi toda você. Você é o amor que eu sempre busquei e por isso minha vida se tornou você.',
                found: false,
                element: null,
                placement: '.special-moments'
            },
            {
                id: 'treasure-5',
                icon: 'fa-heart',
                hint: 'Nossos símbolos de amor...',
                message: 'Eu sou seu gato malhado, vim te ver. Sou seu e sempre serei seu.',
                found: false,
                element: null,
                placement: '.our-symbols'
            },
            {
                id: 'treasure-6',
                icon: 'fa-map-marker-alt',
                hint: 'Lugares especiais em nosso coração...',
                message: 'Eu só quero ser mais feliz, derreter esse coração. Ficar cada vez mais feliz ao seu lado e todos os dias isso acontece mais e mais vezes, por que você é o motivo da minha felicidade.',
                found: false,
                element: null,
                placement: '.places-container'
            },
            {
                id: 'treasure-7',
                icon: 'fa-infinity',
                hint: 'Olhe para nosso futuro brilhante...',
                message: 'Você é a causa da minha euforia. Eu estarei sempre ao seu lado e sempre estarei com o coração batendo cada vez mais forte ao te encontrar e estar com você.',
                found: false,
                element: null,
                placement: '.future-container'
            }
        ];
        
        this.allFoundMessage = "Surpresa! Todo esse tempo você esteve seguindo pistas com frases do BTS! Assim como eles encontraram seu ARMY, eu encontrei você. E assim como eles, eu prometo estar ao seu lado e te amar para sempre! Saranghae! 보라해 (Borahae) - EU TE AMO ATÉ O INFINITO!";
        this.treasuresFound = 0;
        this.btsColors = ['#9b72de', '#f09ead', '#fd9d60', '#6ad3f3', '#fed08c', '#f4c3c5', '#000000'];
    }
    
    init() {
        // Adicionar contador de progresso
        this.createProgressBar();
        
        // Posicionar tesouros em elementos diferentes
        this.placeTreasures();
        
        // Adicionar o painel de dicas
        this.createHintPanel();
    }
    
    createProgressBar() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'treasure-progress themed';
        progressContainer.innerHTML = `
            <div class="treasure-progress-title">
                <i class="fas fa-gem"></i> Caça ao Tesouro <i class="fas fa-gem"></i>
            </div>
            <div class="treasure-progress-label">
                <span id="treasures-found">0</span>/<span>${this.treasures.length}</span> tesouros encontrados
            </div>
            <div class="treasure-progress-bar">
                <div class="treasure-progress-fill" id="treasure-progress-fill"></div>
            </div>
        `;
        
        document.body.appendChild(progressContainer);
    }
    
    updateProgressBar() {
        const progressFill = document.getElementById('treasure-progress-fill');
        const treasuresFoundElement = document.getElementById('treasures-found');
        const percentage = (this.treasuresFound / this.treasures.length) * 100;
        
        progressFill.style.width = `${percentage}%`;
        progressFill.style.background = `linear-gradient(90deg, ${this.btsColors[0]} 0%, ${this.btsColors[this.treasuresFound % this.btsColors.length]} 100%)`;
        treasuresFoundElement.textContent = this.treasuresFound;
        
        // Se todos foram encontrados, mostrar mensagem final
        if (this.treasuresFound === this.treasures.length) {
            setTimeout(() => {
                this.showFinalMessage();
            }, 1000);
        }
    }
    
    createHintPanel() {
        const hintPanel = document.createElement('div');
        hintPanel.className = 'treasure-hint-panel themed';
        hintPanel.innerHTML = `
            <div class="treasure-hint-toggle">
                <i class="fas fa-question"></i>
            </div>
            <div class="treasure-hint-content">
                <h3>Caça ao Tesouro</h3>
                <p>Encontre os 7 tesouros escondidos nesta página! Há uma surpresa especial no final...</p>
                <div class="treasure-hints-container">
                    <div class="treasure-hints">
                        ${this.treasures.map((treasure, index) => `
                            <div class="treasure-hint-item" id="hint-${treasure.id}">
                                <div class="treasure-hint-number" style="background-color: ${this.btsColors[index % this.btsColors.length]}">
                                    ${index + 1}
                                </div>
                                <div class="treasure-hint-text">${treasure.hint}</div>
                                <div class="treasure-hint-status">
                                    <i class="fas fa-times"></i>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(hintPanel);
        
        // Adicionar funcionalidade de toggle
        const toggleButton = hintPanel.querySelector('.treasure-hint-toggle');
        const content = hintPanel.querySelector('.treasure-hint-content');
        
        toggleButton.addEventListener('click', () => {
            content.classList.toggle('visible');
            toggleButton.classList.toggle('active');
        });
    }
    
    placeTreasures() {
        // Colocar cada tesouro em seu lugar específico
        this.treasures.forEach((treasure, index) => {
            const targetElements = document.querySelectorAll(treasure.placement);
            if (targetElements.length === 0) return;
            
            const targetElement = targetElements[0];
            
            // Criar o elemento do tesouro
            const treasureElement = document.createElement('div');
            treasureElement.id = treasure.id;
            treasureElement.className = 'hidden-treasure theme';
            treasureElement.style.backgroundColor = `rgba(${this.getRGBA(this.btsColors[index % this.btsColors.length])}, 0.2)`;
            treasureElement.innerHTML = `<i class="fas ${treasure.icon}"></i>`;
            
            // Posicionar o elemento em um local aleatório dentro do elemento pai
            const posX = Math.floor(Math.random() * 70) + 10; // entre 10% e 80%
            const posY = Math.floor(Math.random() * 70) + 10; // entre 10% e 80%
            
            treasureElement.style.left = `${posX}%`;
            treasureElement.style.top = `${posY}%`;
            
            // Adicionar evento de clique
            treasureElement.addEventListener('click', () => {
                this.findTreasure(treasure.id);
            });
            
            // Adicionar à página
            targetElement.style.position = 'relative';
            targetElement.appendChild(treasureElement);
            
            // Armazenar referência ao elemento
            treasure.element = treasureElement;
        });
    }
    
    getRGBA(hexColor) {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    }
    
    findTreasure(id) {
        const treasure = this.treasures.find(t => t.id === id);
        if (!treasure || treasure.found) return;
        
        // Marcar como encontrado
        treasure.found = true;
        this.treasuresFound++;
        
        // Animar e remover
        if (treasure.element) {
            treasure.element.classList.add('found');
            
            setTimeout(() => {
                if (treasure.element.parentElement) {
                    treasure.element.parentElement.removeChild(treasure.element);
                }
            }, 1000);
        }
        
        // Atualizar UI
        this.updateHintStatus(treasure.id);
        this.updateProgressBar();
        
        // Se for a referência ao Xiumin, ativar Easter Egg
        if (treasure.xiumin) {
            this.showXiuminEasterEgg();
        }
        
        // Mostrar mensagem
        const title = treasure.xiumin ? `Tesouro Encontrado: Xiumin ficaria com inveja!` : 'Tesouro Encontrado!';
        
        Swal.fire({
            title: title,
            html: `
                <div class="treasure-found-message themed">
                    <div class="treasure-found-icon" style="background-color: ${this.btsColors[this.treasuresFound % this.btsColors.length]}">
                        <i class="fas ${treasure.icon}"></i>
                    </div>
                    <p class="${treasure.xiumin ? 'xiumin-message' : ''}">${treasure.message}</p>
                </div>
            `,
            confirmButtonText: 'Continuar Procurando',
            confirmButtonColor: '#ff6b6b',
            background: 'linear-gradient(135deg, #fff9f9 0%, #fff 100%)',
            showClass: {
                popup: 'animate__animated animate__bounceIn'
            }
        });
        
    
    }
    
    showXiuminEasterEgg() {
        // Criar elemento para Easter Egg do Xiumin
        const xiuminEgg = document.createElement('div');
        xiuminEgg.className = 'xiumin-easter-egg';
        xiuminEgg.style.backgroundImage = 'url("images/xiumin.jpg")'; // Imagem do Xiumin
        
        // Definir posição aleatória
        xiuminEgg.style.top = Math.floor(Math.random() * 70) + 10 + '%';
        xiuminEgg.style.left = Math.floor(Math.random() * 70) + 10 + '%';
        
        document.body.appendChild(xiuminEgg);
        
        // Mostrar e esconder após alguns segundos
        setTimeout(() => {
            xiuminEgg.style.opacity = '1';
            
            setTimeout(() => {
                xiuminEgg.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(xiuminEgg);
                }, 500);
            }, 3000);
        }, 100);
    }
    
    updateHintStatus(id) {
        const hintElement = document.getElementById(`hint-${id}`);
        if (!hintElement) return;
        
        const statusIcon = hintElement.querySelector('.treasure-hint-status i');
        statusIcon.className = 'fas fa-check';
        statusIcon.style.color = '#4CAF50';
        hintElement.classList.add('found');
    }
    
    showFinalMessage() {
        const confetti = window.confetti;
        if (confetti) {
            const duration = 5 * 1000;
            const end = Date.now() + duration;
            const colors = this.btsColors;
            
            (function frame() {
                confetti({
                    particleCount: 7,
                    angle: 60,
                    spread: 60,
                    origin: { x: 0, y: 0.5 },
                    colors: colors
                });
                confetti({
                    particleCount: 7,
                    angle: 120,
                    spread: 60,
                    origin: { x: 1, y: 0.5 },
                    colors: colors
                });
                
                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
        
        setTimeout(() => {
            Swal.fire({
                title: 'Parabéns! Você encontrou todos os tesouros!',
                html: `
                    <div class="all-treasures-found bts-themed">
                        <div class="treasure-final-message">${this.allFoundMessage}</div>
                        <div class="bts-members">
                            <div class="bts-heart purple-heart"><i class="fas fa-heart"></i></div>
                            <div class="bts-heart pink-heart"><i class="fas fa-heart"></i></div>
                            <div class="bts-heart orange-heart"><i class="fas fa-heart"></i></div>
                            <div class="bts-heart blue-heart"><i class="fas fa-heart"></i></div>
                            <div class="bts-heart yellow-heart"><i class="fas fa-heart"></i></div>
                            <div class="bts-heart light-pink-heart"><i class="fas fa-heart"></i></div>
                            <div class="bts-heart black-heart"><i class="fas fa-heart"></i></div>
                        </div>
                        <p>Borahae significa "Eu te amarei para sempre" em coreano - o que eu prometo fazer por você todos os dias! 💜</p>
                        <div class="bts-logo">
                            <img src="images/bts-logo.png" alt="BTS Logo" onerror="this.style.display='none';" />
                        </div>
                    </div>
                `,
                confirmButtonText: 'Saranghae! 💜',
                confirmButtonColor: '#9b72de',
                background: 'linear-gradient(135deg, #fff9f9 0%, #fff 100%)',
                showClass: {
                    popup: 'animate__animated animate__zoomIn'
                }
            });
        }, 700);
    }
}

// Inicializar a caça ao tesouro quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const treasureHunt = new TreasureHunt();
        treasureHunt.init();
    }, 2000);
});
