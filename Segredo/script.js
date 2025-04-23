document.addEventListener('DOMContentLoaded', function() {
    // Data de início do relacionamento - ajustado para a data correta
    const startDate = new Date('2023-10-19'); // Formato: AAAA-MM-DD
    
    const envelope = document.getElementById('envelope');
    const message = document.getElementById('message');
    const bgMusic = document.getElementById('bgMusic');
    const toggleMusic = document.getElementById('toggleMusic');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Contador de tempo
    function updateCounter() {
        const now = new Date();
        
        // Calcular diferença exata entre as datas
        const diffTime = now - startDate;
        const isInFuture = diffTime < 0;
        
        // Converter milissegundos para dias (sem arredondamento)
        const absDiffTime = Math.abs(diffTime);
        const diffDays = Math.floor(absDiffTime / (1000 * 60 * 60 * 24));
        
        // Calcular meses (aproximado)
        const diffMonths = Math.floor(diffDays / 30);
        const remainingDays = diffDays % 30;
        
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        let counterText;
        if (isInFuture) {
            counterText = `Faltam ${diffMonths} meses e ${remainingDays} dias<br>` +
                          `(${diffDays} dias no total)<br>` +
                          `${hours}:${minutes}:${seconds}`;
        } else {
            counterText = `${diffMonths} meses e ${remainingDays} dias<br>` +
                          `${diffDays} dias<br>` +
                          `${hours}:${minutes}:${seconds}`;
        }
        
        document.getElementById('counter').innerHTML = counterText;
    }
    
    // Atualiza o contador a cada segundo
    setInterval(updateCounter, 1000);
    updateCounter();
    
    // Animação de abertura da carta
    envelope.addEventListener('click', function() {
        envelope.classList.add('open');
        
        setTimeout(() => {
            envelope.classList.add('hidden');
            message.classList.remove('hidden');
            message.classList.add('show');
            
            // Tenta tocar música após interação do usuário
            playBackgroundMusic();
        }, 1000);
    });
    
    // Controle de música de fundo
    function playBackgroundMusic() {
        bgMusic.play().catch(error => {
            console.log("Reprodução automática bloqueada pelo navegador:", error);
        });
    }
    
    toggleMusic.addEventListener('click', function() {
        if (bgMusic.paused) {
            bgMusic.play();
            toggleMusic.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            bgMusic.pause();
            toggleMusic.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
    
    // Sistema de abas
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active de todas as abas
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adiciona active na aba clicada
            this.classList.add('active');
            
            // Mostra o conteúdo correspondente
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Efeito confete ao abrir a mensagem
    function showConfetti() {
        const duration = 3 * 1000;
        const end = Date.now() + duration;
        
        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ff6b6b', '#ff8e8e', '#ffa5a5']
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ff6b6b', '#ff8e8e', '#ffa5a5']
            });
            
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }
    
    // Carrega biblioteca de confete
    function loadConfetti() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    loadConfetti()
        .then(() => {
            setTimeout(() => {
                message.addEventListener('animationend', function(e) {
                    if (e.animationName === 'expandMessage') {
                        showConfetti();
                    }
                });
            }, 100);
        })
        .catch(error => console.error("Erro ao carregar o confetti:", error));
    
    // Detecta quando é o aniversário de namoro mensal
    function checkMonthAnniversary() {
        const today = new Date();
        if (today.getDate() === startDate.getDate()) {
            Swal.fire({
                title: 'Feliz Aniversário de Namoro!',
                html: `
                    <i class="fas fa-heart" style="color:#ff6b6b; font-size:50px; margin-bottom:15px;"></i>
                    <p>Hoje completamos ${Math.floor(Math.abs(today - startDate) / (1000 * 60 * 60 * 24 * 30))} meses juntos!</p>
                `,
                confirmButtonText: 'Te amo!',
                background: '#fff',
                confirmButtonColor: '#ff6b6b',
                showClass: {
                    popup: 'animate__animated animate__zoomIn'
                }
            });
        }
    }
    
    checkMonthAnniversary();
    
    // Função para manipular a galeria em tela cheia
    function setupPhotoGallery() {
        const photos = document.querySelectorAll('.photo');
        const modal = document.getElementById('photoModal');
        const modalImg = document.getElementById('modalImage');
        const closeBtn = document.querySelector('.close-modal');
        const modalCaption = document.querySelector('.modal-caption');
        const prevBtn = document.getElementById('prevPhoto');
        const nextBtn = document.getElementById('nextPhoto');
        
        let currentPhotoIndex = 0;
        const photoData = [];
        
        // Coletar informações de todas as fotos
        photos.forEach(photo => {
            const imgUrl = photo.style.backgroundImage.slice(4, -1).replace(/["']/g, "");
            const caption = photo.querySelector('.caption').innerText;
            photoData.push({ url: imgUrl, caption: caption });
            
            // Adicionar evento de clique para abrir modal
            photo.addEventListener('click', function() {
                currentPhotoIndex = parseInt(this.getAttribute('data-index'));
                openModal(currentPhotoIndex);
            });
        });
        
        // Abrir modal com foto selecionada
        function openModal(index) {
            modalImg.src = photoData[index].url;
            modalCaption.textContent = photoData[index].caption;
            modal.style.display = 'block';
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Impedir rolagem da página
        }
        
        // Fechar modal
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            modal.classList.remove('show');
            document.body.style.overflow = 'auto'; // Permitir rolagem da página novamente
        });
        
        // Clicar fora da imagem também fecha o modal
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Navegar para a foto anterior
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            currentPhotoIndex = (currentPhotoIndex - 1 + photoData.length) % photoData.length;
            modalImg.src = photoData[currentPhotoIndex].url;
            modalCaption.textContent = photoData[currentPhotoIndex].caption;
        });
        
        // Navegar para a próxima foto
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            currentPhotoIndex = (currentPhotoIndex + 1) % photoData.length;
            modalImg.src = photoData[currentPhotoIndex].url;
            modalCaption.textContent = photoData[currentPhotoIndex].caption;
        });
        
        // Navegar com teclado
        document.addEventListener('keydown', function(e) {
            if (modal.style.display === 'block') {
                if (e.key === 'ArrowLeft') {
                    currentPhotoIndex = (currentPhotoIndex - 1 + photoData.length) % photoData.length;
                    modalImg.src = photoData[currentPhotoIndex].url;
                    modalCaption.textContent = photoData[currentPhotoIndex].caption;
                }
                else if (e.key === 'ArrowRight') {
                    currentPhotoIndex = (currentPhotoIndex + 1) % photoData.length;
                    modalImg.src = photoData[currentPhotoIndex].url;
                    modalCaption.textContent = photoData[currentPhotoIndex].caption;
                }
                else if (e.key === 'Escape') {
                    modal.style.display = 'none';
                    modal.classList.remove('show');
                    document.body.style.overflow = 'auto';
                }
            }
        });
    }
    
    // Chamar a função de configuração da galeria quando o documento estiver carregado
    setupPhotoGallery();
    
    // Adicionar melhorias emocionais
    enhanceEmotionalExperience();
});

// Esta seção foi movida para evitar duplicação

// Configuração da mensagem secreta
function setupSecretMessage() {
    const secretContainer = document.getElementById('secretContainer');
    const secretHeart = document.getElementById('secretHeart');
    const bgMusic = document.getElementById('bgMusic'); // Referência à música de fundo
    
    secretContainer.addEventListener('click', function() {
        // Transformar o container
        secretContainer.classList.add('secret-revealed');
        secretHeart.style.display = 'none';
        
        // Criar e mostrar a mensagem secreta - CORRIGIDA
        const messageElement = document.createElement('div');
        messageElement.classList.add('secret-message-text');
        messageElement.innerHTML = `
            <p style="text-align: center; margin-bottom: 20px;">
                <strong>Lili, minha mulher</strong>
            </p>
            
            <p>Do robô 🤖 à Torre Eiffel 🗼, dos momentos no ônibus às escadas da faculdade, 
            e daquele primeiro encontro no trabalho quando te ajudei com as caixas...</p>
            
            <p>Tudo isso compõe a história mais bonita que eu já vivi.</p>
            
            <p>Obrigado por estar ao meu lado todos os dias e por fazer parte da minha vida.</p>
            
            <p style="text-align: right; margin-top: 20px;">
                Com todo meu amor,<br>
                Vini
            </p>
        `;
        
        secretContainer.appendChild(messageElement);
        
        // Adicionar efeito de confete especial
        if (typeof confetti !== 'undefined') {
            const end = Date.now() + 5000;
            
            const colors = ['#ff6b6b', '#ffc6c6', '#ffffff'];
            
            (function frame() {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors,
                    shapes: ['heart'],
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors,
                    shapes: ['heart'],
                });
                
                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
        
        // Mostrar a mensagem com animação
        setTimeout(() => {
            messageElement.classList.add('show');
            
            // Pausar a música de fundo antes de tocar o som especial
            const bgMusicWasPlaying = !bgMusic.paused;
            bgMusic.pause();
            
            // Tocar um som especial
            const specialSound = new Audio('music/special-moment.mp3');
            specialSound.volume = 0.5;
            
            // Quando o som especial terminar, retomar a música de fundo se estava tocando antes
            specialSound.addEventListener('ended', function() {
                if (bgMusicWasPlaying) {
                    bgMusic.play().catch(error => console.log("Reprodução automática bloqueada:", error));
                }
            });
            
            specialSound.play().catch(error => console.log("Reprodução bloqueada:", error));
            
        }, 500);
    });
}

// Criar efeito de lágrimas na tela
function createTearEffect() {
    // Criar entre 5 e 10 lágrimas
    const numberOfTears = Math.floor(Math.random() * 6) + 5;
    
    for (let i = 0; i < numberOfTears; i++) {
        setTimeout(() => {
            const tear = document.createElement('div');
            tear.classList.add('tear-effect');
            
            // Posição aleatória no topo da tela
            const positionX = Math.random() * window.innerWidth;
            tear.style.left = positionX + 'px';
            
            // Velocidade aleatória
            const duration = Math.random() * 3 + 3; // entre 3 e 6 segundos
            tear.style.animation = `tearDrop ${duration}s forwards`;
            
            document.body.appendChild(tear);
            
            // Remover depois que a animação terminar
            setTimeout(() => {
                document.body.removeChild(tear);
            }, duration * 1000);
        }, i * 700); // Atraso para cada lágrima
    }
}

// Adicionar notificação de coração flutuante
function addHeartNotification() {
    const notification = document.createElement('div');
    notification.classList.add('heart-notification');
    notification.innerHTML = '<i class="fas fa-heart"></i>';
    
    notification.addEventListener('click', function() {
        Swal.fire({
            title: 'Uma mensagem do seu mômô',
            html: 'Cada momento ao seu lado é um presente que guardo com carinho. Obrigado por fazer parte da minha vida e torná-la mais bonita.',
            icon: 'info',
            confirmButtonText: '❤️',
            confirmButtonColor: '#ff6b6b'
        });
        
        // Criar efeito de lágrimas quando clicar
        createTearEffect();
    });
    
    document.body.appendChild(notification);
}

// Adicionar partículas de fundo
function setupParticles() {
    // Verificar se a biblioteca particlesJS está disponível
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 30, density: { enable: true, value_area: 800 } },
                color: { value: "#ff6b6b" },
                shape: {
                    type: "heart",
                    stroke: { width: 0, color: "#000000" },
                },
                opacity: {
                    value: 0.3,
                    random: true,
                    anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
                },
                size: {
                    value: 5,
                    random: true,
                    anim: { enable: true, speed: 4, size_min: 0.3, sync: false }
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                },
            },
            retina_detect: true
        });
    }
}

// Adicionar efeito emocional especial ao abrir a carta
function addEmotionalOpening() {
    envelope.addEventListener('click', function() {
        // Código existente para abrir o envelope
        
        // Adicionar após a abertura do envelope
        setTimeout(() => {
            // Tocar música tema mais emotiva
            bgMusic.volume = 0.4;
            
            // Exibir uma mensagem especial com SweetAlert2
            setTimeout(() => {
                Swal.fire({
                    title: 'Para minha princesa',
                    html: `
                        <div style="margin-bottom:15px">
                            <i class="fas fa-heart" style="color:#ff6b6b; font-size:40px; animation: pulse 1.5s infinite;"></i>
                        </div>
                        <p>Este é um pequeno pedaço do meu coração para você...</p>
                    `,
                    showConfirmButton: false,
                    timer: 3000,
                    backdrop: `rgba(255,107,107,0.4)`,
                    showClass: {
                        popup: 'animate__animated animate__zoomIn'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOut'
                    }
                });
                
                // Criar efeito de lágrimas
                createTearEffect();
            }, 1000);
        }, 1500);
    });
}

// Função para adicionar todas as melhorias emocionais
function enhanceEmotionalExperience() {
    // Adicionar partículas de fundo
    const particlesElement = document.createElement('div');
    particlesElement.id = 'particles-js';
    document.body.insertBefore(particlesElement, document.body.firstChild);
    
    // Carregar bibliotecas extras
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // Carregar biblioteca de partículas
    loadScript('https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js')
        .then(() => {
            setupParticles();
        })
        .catch(error => console.error("Erro ao carregar particles.js:", error));
    
    // Configurar as novas funcionalidades
    setupRandomQuotes();
    setupSecretMessage();
    addHeartNotification();
    addEmotionalOpening();
    
    
    setInterval(() => {
       
        if (Math.random() < 0.2) {
            createTearEffect();
        }
    }, 30000);
}


function setupPersonalizedQuotes() {
    const quoteElement = document.getElementById('randomQuote');
    const newQuoteButton = document.getElementById('newQuote');
    
    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * personalizedQuotes.length);
        
        // Efeito de fade out
        quoteElement.style.opacity = '0';
        
        setTimeout(() => {
            quoteElement.textContent = personalizedQuotes[randomIndex];
            
            // Efeito de fade in
            quoteElement.style.opacity = '1';
        }, 500);
    }
    
    newQuoteButton.addEventListener('click', showRandomQuote);
    
    // Mostrar a primeira citação
    showRandomQuote();
}

// Configuração para os lugares especiais com mensagens ajustadas
function setupSpecialPlaces() {
    const memoryButtons = document.querySelectorAll('.memory-btn');
    
    memoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const place = this.getAttribute('data-place');
            let title, message, iconClass;
            
            switch(place) {
                case 'workplace':
                    title = 'Nossa História no Trabalho';
                    message = 'Quando te ajudei com aquelas caixas, não imaginava que ali seria o começo de uma linda amizade que depois se tornou um forte namoro, naquele tempo eu não sabia o que deus preparava pra mim e hoje eu sei... ele preparou você pra mim, o melhor presente que eu poderia desejar';
                    iconClass = 'fas fa-briefcase';
                    break;
                    
                case 'bus':
                    title = 'Nossos Momentos no Ônibus';
                    message = 'Aquelas viagens de ônibus indo e voltando da faculdade no onibus de sid transformavam o trajeto comum em uma jornada especial. As conversas, os risos, a expectativa de te ver novamente no dia seguinte... cada viagem aproximava mais nossos corações.';
                    iconClass = 'fas fa-bus';
                    break;
                    
                case 'stairs':
                    title = 'Nosso Primeiro Beijo na Escada';
                    message = 'Foi naquela escada da faculdade que nossos lábios se encontraram pela primeira vez. Um momento mágico que está guardado no meu coração para sempre. Nossas almas se conectaram ainda mais naquele beijo que marcou o início de algo maravilhoso.';
                    iconClass = 'fas fa-university';
                    break;
            }
            
            // Exibir a mensagem em um modal bonito
            Swal.fire({
                title: title,
                html: `
                    <div style="margin-bottom:20px">
                        <i class="${iconClass}" style="font-size:40px; color:#ff6b6b; margin-bottom:15px;"></i>
                        <p style="text-align:left; font-size:1.1rem;">${message}</p>
                    </div>
                `,
                confirmButtonText: '❤️',
                confirmButtonColor: '#ff6b6b',
                background: 'linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)',
                showClass: {
                    popup: 'animate__animated animate__fadeIn'
                },
                customClass: {
                    popup: 'memory-popup'
                }
            });
            
            // Criar efeito de lágrimas emocionais
            createTearEffect();
        });
    });
}

// Configurar player de música especial
function setupSpecialSong() {
    const specialSong = document.getElementById('specialSong');
    const bgMusic = document.getElementById('bgMusic');
    
    // Trocar entre as músicas automaticamente
    specialSong.addEventListener('play', function() {
        bgMusic.pause();
    });
    
    specialSong.addEventListener('pause', function() {
        if (bgMusic.paused) {
            bgMusic.play().catch(e => console.log('Reprodução automática bloqueada'));
        }
    });
    
    const songLyrics = document.querySelector('.song-lyrics');
    const lyrics = [
        '"Alô quem tá falando é o grande amor da sua vida quanto tempo eu não te vejo aqui..."',
        '"Me acostumei com a gente sempre junto em nossos planos minha melhor versão tem você..."',
        '"Quando tem você tá tudo feito, perfeito verdade, parei de ter medo..."',
        '"Acordou, já levantou, nem me beijou, nem deu bom dia Seu olhar dizia que algo estranho acontecia..."',
        '"Eu te toco igual violão, esses vizinho se incomoda sozinho nós perde o tempo, nós junto nós perde a hora..."'
    ];
    
    let currentLyric = 0;
    
    // Alternar letras da música
    setInterval(() => {
        songLyrics.style.opacity = '0';
        
        setTimeout(() => {
            currentLyric = (currentLyric + 1) % lyrics.length;
            songLyrics.textContent = lyrics[currentLyric];
            songLyrics.style.opacity = '1';
        }, 500);
    }, 8000);
}

// Criar efeito de lágrimas personalizadas
function createTearEffect() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const tear = document.createElement('div');
            tear.classList.add('tear-drop');
            
            // Posição aleatória
            const positionX = Math.random() * window.innerWidth;
            tear.style.left = positionX + 'px';
            tear.style.top = '0';
            
            // Variações na altura e duração
            const height = 15 + Math.random() * 10;
            const duration = 3 + Math.random() * 4;
            
            tear.style.height = height + 'px';
            tear.style.animationDuration = duration + 's';
            
            document.body.appendChild(tear);
            
            // Remover após a animação
            setTimeout(() => {
                if (document.body.contains(tear)) {
                    document.body.removeChild(tear);
                }
            }, duration * 1000);
        }, i * 300);
    }
}

// Adicionar animação do robô flutuante
function createRobotAnimation() {
    const robot = document.createElement('div');
    robot.className = 'floating-robot';
    robot.innerHTML = '<i class="fas fa-robot"></i>';
    document.body.appendChild(robot);
    
    // Remover robô após a animação
    setTimeout(() => {
        if (document.body.contains(robot)) {
            document.body.removeChild(robot);
        }
    }, 15000);
}

// Adicionar silhueta da Torre Eiffel
function addEiffelTower() {
    const tower = document.createElement('div');
    tower.className = 'eiffel-tower';
    document.body.appendChild(tower);
}

// Personalizar a abertura do envelope
function customizeEnvelopeOpening() {
    const envelope = document.getElementById('envelope');
    
    envelope.addEventListener('click', function() {
        // Código existente para abrir o envelope
        
        // Adicionar efeito personalizado
        setTimeout(() => {
            Swal.fire({
                title: 'Para Liliane',
                html: `
                    <div style="margin:15px 0">
                        <i class="fas fa-robot" style="color:#6ec6ff; font-size:40px; margin-right:15px;"></i>
                        <i class="fas fa-heart" style="color:#ff6b6b; font-size:30px;"></i>
                        <i class="fas fa-monument" style="color:#ff6b6b; font-size:40px; margin-left:15px;"></i>
                    </div>
                    <p style="font-family:'Dancing Script', cursive; font-size:1.3rem;">De Vinicio, com todo meu amor...</p>
                `,
                showConfirmButton: false,
                timer: 3000,
                background: 'linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)',
                showClass: {
                    popup: 'animate__animated animate__zoomIn'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOut'
                }
            });
            
            // Criar efeito de lágrimas
            createTearEffect();
            
            // Iniciar a animação do robô
            setTimeout(createRobotAnimation, 3000);
        }, 1500);
    });
}

// Personalizar a detecção de aniversário mensal
function customizeMonthlyAnniversary() {
    const startDate = new Date('2023-06-01'); // Ajuste para a data correta do relacionamento
    const today = new Date();
    
    if (today.getDate() === startDate.getDate()) {
        setTimeout(() => {
            Swal.fire({
                title: 'Feliz Aniversário de Namoro!',
                html: `
                    <div style="margin:15px 0">
                        <i class="fas fa-robot" style="color:#6ec6ff; font-size:40px; margin-right:15px;"></i>
                        <i class="fas fa-heart" style="color:#ff6b6b; font-size:30px; animation: pulse-heart 1.5s infinite;"></i>
                        <i class="fas fa-monument" style="color:#ff6b6b; font-size:40px; margin-left:15px;"></i>
                    </div>
                    <p style="font-family:'Dancing Script', cursive; font-size:1.3rem; margin-top:10px;">Vinicio & Liliane</p>
                    <p>Hoje completamos ${Math.floor(Math.abs(today - startDate) / (1000 * 60 * 60 * 24 * 30))} meses juntos!</p>
                `,
                confirmButtonText: 'Te Amo!',
                confirmButtonColor: '#ff6b6b',
                background: 'linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)',
                showClass: {
                    popup: 'animate__animated animate__zoomIn'
                }
            });
            
            createTearEffect();
        }, 5000);
    }
}

// Personalizar a mensagem secreta
function customizeSecretMessage() {
    const secretContainer = document.getElementById('secretContainer');
    const secretHeart = document.getElementById('secretHeart');
    const bgMusic = document.getElementById('bgMusic');
    
    secretContainer.addEventListener('click', function() {
        // Transformar o container
        secretContainer.classList.add('secret-revealed');
        secretHeart.style.display = 'none';
        
        // Criar a mensagem personalizada - CORRIGIDA
        const messageElement = document.createElement('div');
        messageElement.classList.add('secret-message-text');
        messageElement.innerHTML = `
            <p style="text-align: center; margin-bottom: 20px;">
                <strong>Lili, minha mulher</strong>
            </p>
            
            <p>Do robô 🤖 à Torre Eiffel 🗼, dos momentos no ônibus às escadas da faculdade, 
            e daquele primeiro encontro no trabalho quando te ajudei com as caixas...</p>
            
            <p>Tudo isso compõe a história mais bonita que eu já vivi.</p>
            
            <p>Obrigado por estar ao meu lado todos os dias e por fazer parte da minha vida.</p>
            
            <p style="text-align: right; margin-top: 20px;">
                Com todo meu amor,<br>
                Vini
            </p>
        `;
        
        secretContainer.appendChild(messageElement);
        
        // Salvar estado da música de fundo
        const bgMusicWasPlaying = !bgMusic.paused;
        
        // Pausar a música de fundo
        bgMusic.pause();
        
        // Mostrar a mensagem com animação
        setTimeout(() => {
            messageElement.classList.add('show');
            
            // Criar efeitos especiais
            createTearEffect();
            
            // Iniciar a animação do robô
            setTimeout(createRobotAnimation, 2000);
            
            // Tocar um som especial
            const specialSound = new Audio('music/special-moment.mp3');
            specialSound.volume = 0.5;
            
            // Quando o som especial terminar, voltar a música de fundo se estava tocando
            specialSound.addEventListener('ended', function() {
                if (bgMusicWasPlaying) {
                    bgMusic.play().catch(error => console.log("Reprodução bloqueada:", error));
                }
            });
            
            specialSound.play().catch(error => console.log("Reprodução bloqueada:", error));
        }, 500);
    });
}

// Função principal para melhorar a experiência do aplicativo
function enhanceAppExperience() {
    // Adicionar Torre Eiffel no fundo
    addEiffelTower();
    
    // Configurar citações personalizadas
    setupPersonalizedQuotes();
    
    // Configurar lugares especiais
    setupSpecialPlaces();
    
    // Configurar música
    setupMusic();
    
    // Personalizar abertura do envelope
    customizeEnvelopeOpening();
    
    // Personalizar aniversário mensal
    customizeMonthlyAnniversary();
    
    // Personalizar mensagem secreta
    customizeSecretMessage();
    
    // Iniciar animação do robô periodicamente
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% de chance a cada minuto
            createRobotAnimation();
        }
    }, 60000);
}

// Adicionando ao carregamento do documento
document.addEventListener('DOMContentLoaded', function() {
    // Código existente
    
    // Adicionar melhorias ao app
    enhanceAppExperience();
});

// Citações românticas para exibição aleatória
const romanticQuotes = [
    "Cada batida do meu coração te pertence. Cada suspiro, cada sorriso, cada lágrima de felicidade existe por você.",
    "Te amo mais hoje do que ontem, mas menos do que amanhã. Meu amor por você cresce a cada momento.",
    "Quando te conheci, não imaginava que encontraria em uma única pessoa todos os sonhos que eu nem sabia que tinha.",
    "Você é o sonho que eu não sabia que estava sonhando até o momento em que te encontrei.",
    "Quero envelhecer ao seu lado e viver ao seu lado para sempre.",
    "Se o universo conspirasse para criar o amor perfeito para mim, ainda assim não seria tão maravilhoso quanto o que sinto por você.",
    "Cada momento longe de você é um momento que meu coração espera ansiosamente pelo reencontro.",
    "Olhar nos seus olhos é como encontrar o caminho para casa depois de estar perdido por muito tempo.",
    "Seu sorriso é a primeira coisa que quero ver todas as manhãs e a última coisa que quero lembrar antes de dormir.",
    "Não existe distância que o amor não possa percorrer nem tempo que o possa diminuir quando dois corações batem como um só."
];

// Função para mostrar citações aleatórias
function setupRandomQuotes() {
    const quoteElement = document.getElementById('randomQuote');
    const newQuoteButton = document.getElementById('newQuote');
    
    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * romanticQuotes.length);
        quoteElement.textContent = romanticQuotes[randomIndex];
        
        // Adicionar animação
        quoteElement.style.opacity = '0';
        quoteElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            quoteElement.style.transition = 'all 0.5s ease-in-out';
            quoteElement.style.opacity = '1';
            quoteElement.style.transform = 'translateY(0)';
        }, 100);
    }
    
    newQuoteButton.addEventListener('click', showRandomQuote);
    
    // Mostrar a primeira citação
    showRandomQuote();
}

// Configuração da mensagem secreta
function setupSecretMessage() {
    const secretContainer = document.getElementById('secretContainer');
    const secretHeart = document.getElementById('secretHeart');
    const bgMusic = document.getElementById('bgMusic'); // Referência à música de fundo
    
    secretContainer.addEventListener('click', function() {
        // Mostrar mensagem em um pop-up em vez de modificar o container
        Swal.fire({
            title: 'Lili, minha mulher',
            html: `
                <div class="secret-message-popup">
                    <p>Do robô 🤖 à Torre Eiffel 🗼, dos momentos no ônibus às escadas da faculdade, 
                    e daquele primeiro encontro no trabalho quando te ajudei com as caixas...</p>
                    
                    <p>Tudo isso compõe a história mais bonita que eu já vivi.</p>
                    
                    <p>Obrigado por estar ao meu lado todos os dias e por fazer parte da minha vida.</p>
                    
                    <p class="signature">
                        Com todo meu amor,<br>
                        Vini
                    </p>
                </div>
            `,
            showCloseButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Te amo! ❤️',
            confirmButtonColor: '#ff6b6b',
            background: 'linear-gradient(135deg, #fff9f9 0%, #fff 100%)',
            showClass: {
                popup: 'animate__animated animate__zoomIn'
            },
            hideClass: {
                popup: 'animate__animated animate__zoomOut'
            }
        });
        
        // Adicionar efeito de confete
        if (typeof confetti !== 'undefined') {
            const end = Date.now() + 3000;
            const colors = ['#ff6b6b', '#ffc6c6', '#ffffff'];
            
            (function frame() {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0.3, y: 0.5 },
                    colors: colors,
                    shapes: ['heart'],
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 0.7, y: 0.5 },
                    colors: colors,
                    shapes: ['heart'],
                });
                
                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
        
        // Criar efeito de lágrimas
        createTearEffect();
        
        // Iniciar a animação do robô
        setTimeout(createRobotAnimation, 1000);
    });
}

// Criar efeito de lágrimas na tela
function createTearEffect() {
    // Criar entre 5 e 10 lágrimas
    const numberOfTears = Math.floor(Math.random() * 6) + 5;
    
    for (let i = 0; i < numberOfTears; i++) {
        setTimeout(() => {
            const tear = document.createElement('div');
            tear.classList.add('tear-effect');
            
            // Posição aleatória no topo da tela
            const positionX = Math.random() * window.innerWidth;
            tear.style.left = positionX + 'px';
            
            // Velocidade aleatória
            const duration = Math.random() * 3 + 3; // entre 3 e 6 segundos
            tear.style.animation = `tearDrop ${duration}s forwards`;
            
            document.body.appendChild(tear);
            
            // Remover depois que a animação terminar
            setTimeout(() => {
                document.body.removeChild(tear);
            }, duration * 1000);
        }, i * 700); // Atraso para cada lágrima
    }
}

// Adicionar notificação de coração flutuante
function addHeartNotification() {
    const notification = document.createElement('div');
    notification.classList.add('heart-notification');
    notification.innerHTML = '<i class="fas fa-heart"></i>';
    
    notification.addEventListener('click', function() {
        Swal.fire({
            title: 'Uma mensagem do seu mômô',
            html: 'Cada momento ao seu lado é um presente que guardo com carinho. Obrigado por fazer parte da minha vida e torná-la mais bonita.',
            icon: 'info',
            confirmButtonText: '❤️',
            confirmButtonColor: '#ff6b6b'
        });
        
        // Criar efeito de lágrimas quando clicar
        createTearEffect();
    });
    
    document.body.appendChild(notification);
}

// Adicionar partículas de fundo
function setupParticles() {
    // Verificar se a biblioteca particlesJS está disponível
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 30, density: { enable: true, value_area: 800 } },
                color: { value: "#ff6b6b" },
                shape: {
                    type: "heart",
                    stroke: { width: 0, color: "#000000" },
                },
                opacity: {
                    value: 0.3,
                    random: true,
                    anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
                },
                size: {
                    value: 5,
                    random: true,
                    anim: { enable: true, speed: 4, size_min: 0.3, sync: false }
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                },
            },
            retina_detect: true
        });
    }
}

// Adicionar efeito emocional especial ao abrir a carta
function addEmotionalOpening() {
    envelope.addEventListener('click', function() {
        // Código existente para abrir o envelope
        
        // Adicionar após a abertura do envelope
        setTimeout(() => {
            // Tocar música tema mais emotiva
            bgMusic.volume = 0.4;
            
            // Exibir uma mensagem especial com SweetAlert2
            setTimeout(() => {
                Swal.fire({
                    title: 'Para minha princesa',
                    html: `
                        <div style="margin-bottom:15px">
                            <i class="fas fa-heart" style="color:#ff6b6b; font-size:40px; animation: pulse 1.5s infinite;"></i>
                        </div>
                        <p>Este é um pequeno pedaço do meu coração para você...</p>
                    `,
                    showConfirmButton: false,
                    timer: 3000,
                    backdrop: `rgba(255,107,107,0.4)`,
                    showClass: {
                        popup: 'animate__animated animate__zoomIn'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOut'
                    }
                });
                
                // Criar efeito de lágrimas
                createTearEffect();
            }, 1000);
        }, 1500);
    });
}

// Função para adicionar todas as melhorias emocionais
function enhanceEmotionalExperience() {
    // Adicionar partículas de fundo
    const particlesElement = document.createElement('div');
    particlesElement.id = 'particles-js';
    document.body.insertBefore(particlesElement, document.body.firstChild);
    
    // Carregar bibliotecas extras
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // Carregar biblioteca de partículas
    loadScript('https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js')
        .then(() => {
            setupParticles();
        })
        .catch(error => console.error("Erro ao carregar particles.js:", error));
    
    // Configurar as novas funcionalidades
    setupRandomQuotes();
    setupSecretMessage();
    addHeartNotification();
    addEmotionalOpening();
    
    // Programar efeito de lágrimas periódico
    setInterval(() => {
        // 20% de chance de mostrar uma lágrima a cada 30 segundos
        if (Math.random() < 0.2) {
            createTearEffect();
        }
    }, 30000);
}

// Personalizando as citações românticas com elementos do relacionamento
const personalizedQuotes = [
    "Minha historia até chegar em você é como se fosse uma preparatoria ate o seu encontro, meu destino era te encontrar!",
    "Do primeiro momento no trabalho com as caixas, mesmo que incoscientemente eu ja sabia que iria cuidar de você para sempre!",
    "Nosso amor é como a Torre Eiffel: forte, único e tão especial que todo mundo admira.",
    "As conversas no ônibus podem parecer simples, mas foram nelas que nossos corações aprenderam a se conectar.",
    "Nas escadas da faculdade, naquele 5° andar especificamente foi onde nossos labios se tocaram pela primeira vez.",
    "Vinicio e Liliane, uma historia de amor que nunca terá fim e estamos somente no começo!",
    "Se Paris é a cidade do amor, você, Liliane, é a minha Paris particular todos os dias.",
    "Nossa história começou com caixas, continuou em ônibus e escadas, e agora não tem mais limites.",
    "Se pudesse te dar um presente, seria Paris, mas enquanto não posso, te dou todo o meu amor.",
    "Seu sorriso ilumina meus dias como o sol que ilumina você todos os dias para que brilhe para mim cada vez mais."
];

// Configuração para exibir as citações personalizadas
function setupPersonalizedQuotes() {
    const quoteElement = document.getElementById('randomQuote');
    const newQuoteButton = document.getElementById('newQuote');
    
    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * personalizedQuotes.length);
        
        // Efeito de fade out
        quoteElement.style.opacity = '0';
        
        setTimeout(() => {
            quoteElement.textContent = personalizedQuotes[randomIndex];
            
            // Efeito de fade in
            quoteElement.style.opacity = '1';
        }, 500);
    }
    
    newQuoteButton.addEventListener('click', showRandomQuote);
    
    // Mostrar a primeira citação
    showRandomQuote();
}

// Configuração para os lugares especiais com mensagens ajustadas
function setupSpecialPlaces() {
    const memoryButtons = document.querySelectorAll('.memory-btn');
    
    memoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const place = this.getAttribute('data-place');
            let title, message, iconClass;
            
            switch(place) {
                case 'workplace':
                    title = 'Nossa História no Trabalho';
                    message = 'Quando te ajudei com aquelas caixas, não imaginava que ali seria o começo de uma linda amizade que depois se tornou um forte namoro, naquele tempo eu não sabia o que deus preparava pra mim e hoje eu sei... ele preparou você pra mim, o melhor presente que eu poderia desejar';
                    iconClass = 'fas fa-briefcase';
                    break;
                    
                case 'bus':
                    title = 'Nossos Momentos no Ônibus';
                    message = 'Aquelas viagens de ônibus indo e voltando da faculdade no onibus de sid transformavam o trajeto comum em uma jornada especial. As conversas, os risos, a expectativa de te ver novamente no dia seguinte... cada viagem aproximava mais nossos corações.';
                    iconClass = 'fas fa-bus';
                    break;
                    
                case 'stairs':
                    title = 'Nosso Primeiro Beijo na Escada';
                    message = 'Foi naquela escada da faculdade que nossos lábios se encontraram pela primeira vez. Um momento mágico que está guardado no meu coração para sempre. Nossas almas se conectaram ainda mais naquele beijo que marcou o início de algo maravilhoso.';
                    iconClass = 'fas fa-university';
                    break;
            }
            
            // Exibir a mensagem em um modal bonito
            Swal.fire({
                title: title,
                html: `
                    <div style="margin-bottom:20px">
                        <i class="${iconClass}" style="font-size:40px; color:#ff6b6b; margin-bottom:15px;"></i>
                        <p style="text-align:left; font-size:1.1rem;">${message}</p>
                    </div>
                `,
                confirmButtonText: '❤️',
                confirmButtonColor: '#ff6b6b',
                background: 'linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)',
                showClass: {
                    popup: 'animate__animated animate__fadeIn'
                },
                customClass: {
                    popup: 'memory-popup'
                }
            });
            
            // Criar efeito de lágrimas emocionais
            createTearEffect();
        });
    });
}

// Configurar player de música especial
function setupSpecialSong() {
    const specialSong = document.getElementById('specialSong');
    const bgMusic = document.getElementById('bgMusic');
    
    // Trocar entre as músicas automaticamente
    specialSong.addEventListener('play', function() {
        bgMusic.pause();
    });
    
    specialSong.addEventListener('pause', function() {
        if (bgMusic.paused) {
            bgMusic.play().catch(e => console.log('Reprodução automática bloqueada'));
        }
    });
    
    const songLyrics = document.querySelector('.song-lyrics');
    const lyrics = [
        '"Alô quem tá falando é o grande amor da sua vida quanto tempo eu não te vejo aqui..."',
        '"Me acostumei com a gente sempre junto em nossos planos minha melhor versão tem você..."',
        '"Quando tem você tá tudo feito, perfeito verdade, parei de ter medo..."',
        '"Acordou, já levantou, nem me beijou, nem deu bom dia Seu olhar dizia que algo estranho acontecia..."',
        '"Eu te toco igual violão, esses vizinho se incomoda sozinho nós perde o tempo, nós junto nós perde a hora..."'
    ];
    
    let currentLyric = 0;
    
    // Alternar letras da música
    setInterval(() => {
        songLyrics.style.opacity = '0';
        
        setTimeout(() => {
            currentLyric = (currentLyric + 1) % lyrics.length;
            songLyrics.textContent = lyrics[currentLyric];
            songLyrics.style.opacity = '1';
        }, 500);
    }, 8000);
}

// Criar efeito de lágrimas personalizadas
function createTearEffect() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const tear = document.createElement('div');
            tear.classList.add('tear-drop');
            
            // Posição aleatória
            const positionX = Math.random() * window.innerWidth;
            tear.style.left = positionX + 'px';
            tear.style.top = '0';
            
            // Variações na altura e duração
            const height = 15 + Math.random() * 10;
            const duration = 3 + Math.random() * 4;
            
            tear.style.height = height + 'px';
            tear.style.animationDuration = duration + 's';
            
            document.body.appendChild(tear);
            
            // Remover após a animação
            setTimeout(() => {
                if (document.body.contains(tear)) {
                    document.body.removeChild(tear);
                }
            }, duration * 1000);
        }, i * 300);
    }
}

// Adicionar animação do robô flutuante
function createRobotAnimation() {
    const robot = document.createElement('div');
    robot.className = 'floating-robot';
    robot.innerHTML = '<i class="fas fa-robot"></i>';
    document.body.appendChild(robot);
    
    // Remover robô após a animação
    setTimeout(() => {
        if (document.body.contains(robot)) {
            document.body.removeChild(robot);
        }
    }, 15000);
}

// Adicionar silhueta da Torre Eiffel
function addEiffelTower() {
    const tower = document.createElement('div');
    tower.className = 'eiffel-tower';
    document.body.appendChild(tower);
}

// Personalizar a abertura do envelope
function customizeEnvelopeOpening() {
    const envelope = document.getElementById('envelope');
    
    envelope.addEventListener('click', function() {
        // Código existente para abrir o envelope
        
        // Adicionar efeito personalizado
        setTimeout(() => {
            Swal.fire({
                title: 'Para Liliane',
                html: `
                    <div style="margin:15px 0">
                        <i class="fas fa-robot" style="color:#6ec6ff; font-size:40px; margin-right:15px;"></i>
                        <i class="fas fa-heart" style="color:#ff6b6b; font-size:30px;"></i>
                        <i class="fas fa-monument" style="color:#ff6b6b; font-size:40px; margin-left:15px;"></i>
                    </div>
                    <p style="font-family:'Dancing Script', cursive; font-size:1.3rem;">De Vinicio, com todo meu amor...</p>
                `,
                showConfirmButton: false,
                timer: 3000,
                background: 'linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)',
                showClass: {
                    popup: 'animate__animated animate__zoomIn'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOut'
                }
            });
            
            // Criar efeito de lágrimas
            createTearEffect();
            
            // Iniciar a animação do robô
            setTimeout(createRobotAnimation, 3000);
        }, 1500);
    });
}

// Personalizar a detecção de aniversário mensal
function customizeMonthlyAnniversary() {
    const startDate = new Date('2023-06-01'); // Ajuste para a data correta do relacionamento
    const today = new Date();
    
    if (today.getDate() === startDate.getDate()) {
        setTimeout(() => {
            Swal.fire({
                title: 'Feliz Aniversário de Namoro!',
                html: `
                    <div style="margin:15px 0">
                        <i class="fas fa-robot" style="color:#6ec6ff; font-size:40px; margin-right:15px;"></i>
                        <i class="fas fa-heart" style="color:#ff6b6b; font-size:30px; animation: pulse-heart 1.5s infinite;"></i>
                        <i class="fas fa-monument" style="color:#ff6b6b; font-size:40px; margin-left:15px;"></i>
                    </div>
                    <p style="font-family:'Dancing Script', cursive; font-size:1.3rem; margin-top:10px;">Vinicio & Liliane</p>
                    <p>Hoje completamos ${Math.floor(Math.abs(today - startDate) / (1000 * 60 * 60 * 24 * 30))} meses juntos!</p>
                `,
                confirmButtonText: 'Te Amo!',
                confirmButtonColor: '#ff6b6b',
                background: 'linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)',
                showClass: {
                    popup: 'animate__animated animate__zoomIn'
                }
            });
            
            createTearEffect();
        }, 5000);
    }
}

// Personalizar a mensagem secreta
function customizeSecretMessage() {
    const secretContainer = document.getElementById('secretContainer');
    const secretHeart = document.getElementById('secretHeart');
    const bgMusic = document.getElementById('bgMusic');
    
    secretContainer.addEventListener('click', function() {
        // Mostrar mensagem em um pop-up em vez de modificar o container
        Swal.fire({
            title: 'Lili, minha mulher',
            html: `
                <div class="secret-message-popup">
                    <p>Do robô 🤖 à Torre Eiffel 🗼, dos momentos no ônibus às escadas da faculdade, 
                    e daquele primeiro encontro no trabalho quando te ajudei com as caixas...</p>
                    
                    <p>Tudo isso compõe a história mais bonita que eu já vivi.</p>
                    
                    <p>Obrigado por estar ao meu lado todos os dias e por fazer parte da minha vida.</p>
                    
                    <p class="signature">
                        Com todo meu amor,<br>
                        Vini
                    </p>
                </div>
            `,
            showCloseButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Te amo! ❤️',
            confirmButtonColor: '#ff6b6b',
            background: 'linear-gradient(135deg, #fff9f9 0%, #fff 100%)',
            showClass: {
                popup: 'animate__animated animate__zoomIn'
            },
            hideClass: {
                popup: 'animate__animated animate__zoomOut'
            }
        });
        
        // Adicionar efeito de confete
        if (typeof confetti !== 'undefined') {
            const end = Date.now() + 3000;
            const colors = ['#ff6b6b', '#ffc6c6', '#ffffff'];
            
            (function frame() {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0.3, y: 0.5 },
                    colors: colors,
                    shapes: ['heart'],
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 0.7, y: 0.5 },
                    colors: colors,
                    shapes: ['heart'],
                });
                
                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
        
        // Criar efeito de lágrimas
        createTearEffect();
        
        // Iniciar a animação do robô
        setTimeout(createRobotAnimation, 1000);
    });
}

// Função principal para melhorar a experiência do aplicativo
function enhanceAppExperience() {
    // Adicionar Torre Eiffel no fundo
    addEiffelTower();
    
    // Configurar citações personalizadas
    setupPersonalizedQuotes();
    
    // Configurar lugares especiais
    setupSpecialPlaces();
    
    // Configurar música
    setupMusic();
    
    // Personalizar abertura do envelope
    customizeEnvelopeOpening();
    
    // Personalizar aniversário mensal
    customizeMonthlyAnniversary();
    
    // Personalizar mensagem secreta
    customizeSecretMessage();
    
    // Iniciar animação do robô periodicamente
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% de chance a cada minuto
            createRobotAnimation();
        }
    }, 60000);
}

// Adicionando ao carregamento do documento
document.addEventListener('DOMContentLoaded', function() {
    // Código existente
    
    // Adicionar melhorias ao app
    enhanceAppExperience();
});

// Configuração para o carregamento da música - substituir a função anterior
function setupMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const toggleMusic = document.getElementById('toggleMusic');
    
    // Definir "Paris" como a música de fundo principal
    bgMusic.src = 'music/paris-poesia-acustica.mp3';
    
    // Atualizar as letras periodicamente
    const lyrics = [
        '"Alô quem tá falando é o grande amor da sua vida quanto tempo eu não te vejo aqui..."',
        '"Me acostumei com a gente sempre junto em nossos planos minha melhor versão tem você..."',
        '"Quando tem você tá tudo feito, perfeito verdade, parei de ter medo..."',
        '"Acordou, já levantou, nem me beijou, nem deu bom dia Seu olhar dizia que algo estranho acontecia..."',
        '"Eu te toco igual violão, esses vizinho se incomoda sozinho nós perde o tempo, nós junto nós perde a hora..."'
    ];
    
    const songLyrics = document.querySelector('.song-lyrics');
    let currentLyric = 0;
    
    // Alternar letras da música
    setInterval(() => {
        songLyrics.style.opacity = '0';
        
        setTimeout(() => {
            currentLyric = (currentLyric + 1) % lyrics.length;
            songLyrics.textContent = lyrics[currentLyric];
            songLyrics.style.opacity = '1';
        }, 500);
    }, 8000);
    
    // Controle do botão de música
    toggleMusic.addEventListener('click', function() {
        if (bgMusic.paused) {
            bgMusic.play();
            toggleMusic.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            bgMusic.pause();
            toggleMusic.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
}

// Função para configurar o controle de música
function setupMusicControl() {
    const bgMusic = document.getElementById('bgMusic');
    const toggleMusic = document.getElementById('toggleMusic');
    
    // Configurar o botão de controle de música
    toggleMusic.addEventListener('click', function() {
        if (bgMusic.paused) {
            bgMusic.play().catch(e => console.log("Reprodução automática bloqueada:", e));
            toggleMusic.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            bgMusic.pause();
            toggleMusic.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
    
    // Garantir que o ícone correto seja exibido no carregamento
    bgMusic.addEventListener('playing', function() {
        toggleMusic.innerHTML = '<i class="fas fa-volume-up"></i>';
    });
    
    bgMusic.addEventListener('pause', function() {
        toggleMusic.innerHTML = '<i class="fas fa-volume-mute"></i>';
    });
}

// Certifique-se de chamar esta função após o carregamento do documento
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    
    // Adicionar ou garantir que esta linha esteja presente
    setupMusicControl();
    
    // ...existing code...
});

// Nova função para inicializar os recursos adicionais
function initializeExtraFeatures() {
    // Inicializar sistema de notas de amor
    if (window.LoveNoteSystem) {
        const loveNotes = new LoveNoteSystem({
            minInterval: 45000,  // 45 segundos
            maxInterval: 120000  // 2 minutos
        });
        loveNotes.init();
    }
    
    // Inicializar caça ao tesouro
    if (window.TreasureHunt) {
        // Atraso para iniciar a caça ao tesouro após a página estar totalmente carregada
        setTimeout(() => {
            const treasureHunt = new TreasureHunt();
            treasureHunt.init();
        }, 2000);
    }
    
    // Inicializar datas especiais
    if (window.SpecialDates) {
        const specialDates = new SpecialDates();
        specialDates.init();
    }
    
    // Inicializar timeline aprimorada
    if (window.RelationshipTimeline) {
        const timeline = new RelationshipTimeline();
        timeline.init();
    }
}

// Adicione uma chamada para esta função no evento DOMContentLoaded principal
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    
    // Inicializar os recursos extras após um pequeno atraso
    setTimeout(initializeExtraFeatures, 1000);
});

// Função para atualizar a data da carta para o dia atual
function atualizarDataCarta() {
    const cartaConteudo = document.querySelector('.love-letter');
    if (cartaConteudo) {
        const hoje = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dataFormatada = hoje.toLocaleDateString('pt-BR', options);
        
        let texto = cartaConteudo.innerHTML;
        // Substitui a primeira ocorrência de data por hoje
        texto = texto.replace(/\b\d{1,2}\s+de\s+[a-zç]+\s+de\s+\d{4}\b/i, dataFormatada);
        cartaConteudo.innerHTML = texto;
    }
}

// Função para ativar Easter Egg do Xiumin
function setupXiuminEasterEgg() {
    const logo = document.querySelector('.envelope .heart');
    if (logo) {
        logo.addEventListener('click', function(event) {
            event.stopPropagation(); // Evita abrir o envelope
            xiuminClickCount++;
            
            if (xiuminClickCount >= xiuminClickThreshold) {
                // Criar elemento para Easter Egg do Xiumin
                const xiuminEgg = document.createElement('div');
                xiuminEgg.className = 'xiumin-easter-egg';
                xiuminEgg.style.backgroundImage = 'url("images/xiumin.jpg")';
                xiuminEgg.style.position = 'fixed';
                xiuminEgg.style.top = '50%';
                xiuminEgg.style.left = '50%';
                xiuminEgg.style.transform = 'translate(-50%, -50%)';
                xiuminEgg.style.width = '200px';
                xiuminEgg.style.height = '200px';
                xiuminEgg.style.zIndex = '9999';
                
                document.body.appendChild(xiuminEgg);
                
                // Mostrar e esconder após alguns segundos
                setTimeout(() => {
                    xiuminEgg.style.opacity = '1';
                    
                    // Adicionar texto de provocação
                    const xiuminText = document.createElement('div');
                    xiuminText.innerHTML = 'Lembra como eu te provocava com o Xiumin? 😂';
                    xiuminText.style.position = 'fixed';
                    xiuminText.style.top = 'calc(50% + 100px)';
                    xiuminText.style.left = '50%';
                    xiuminText.style.transform = 'translateX(-50%)';
                    xiuminText.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                    xiuminText.style.padding = '10px';
                    xiuminText.style.borderRadius = '5px';
                    xiuminText.style.fontWeight = 'bold';
                    xiuminText.style.color = '#ff6b6b';
                    xiuminText.style.zIndex = '9999';
                    
                    document.body.appendChild(xiuminText);
                    
                    setTimeout(() => {
                        xiuminEgg.style.opacity = '0';
                        xiuminText.style.opacity = '0';
                        setTimeout(() => {
                            document.body.removeChild(xiuminEgg);
                            document.body.removeChild(xiuminText);
                            xiuminClickCount = 0;
                        }, 500);
                    }, 3000);
                }, 100);
            }
        });
    }
}

// Inicializar os recursos
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    
    // Atualizar data da carta para hoje
    atualizarDataCarta();
    
    // Configurar Easter Egg do Xiumin
    setupXiuminEasterEgg();
    
    // ...existing code...
});

// Função para animar a timeline
function setupTimelineAnimation() {
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

// Adicionar a chamada da função no carregamento do documento
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    
    // Animar a timeline quando a página carregar
    setupTimelineAnimation();
});

// Configuração para o carregamento da música - substituir a função anterior
function setupMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const toggleMusic = document.getElementById('toggleMusic');
    
    // Definir "Paris" como a música de fundo principal
    bgMusic.src = 'music/paris-poesia-acustica.mp3';
    
    // Atualizar as letras periodicamente
    const lyrics = [
        '"Alô quem tá falando é o grande amor da sua vida quanto tempo eu não te vejo aqui..."',
        '"Me acostumei com a gente sempre junto em nossos planos minha melhor versão tem você..."',
        '"Quando tem você tá tudo feito, perfeito verdade, parei de ter medo..."',
        '"Acordou, já levantou, nem me beijou, nem deu bom dia Seu olhar dizia que algo estranho acontecia..."',
        '"Eu te toco igual violão, esses vizinho se incomoda sozinho nós perde o tempo, nós junto nós perde a hora..."'
    ];
    
    const songLyrics = document.querySelector('.song-lyrics');
    let currentLyric = 0;
    
    // Alternar letras da música
    setInterval(() => {
        songLyrics.style.opacity = '0';
        
        setTimeout(() => {
            currentLyric = (currentLyric + 1) % lyrics.length;
            songLyrics.textContent = lyrics[currentLyric];
            songLyrics.style.opacity = '1';
        }, 500);
    }, 8000);
    
    // Controle do botão de música
    toggleMusic.addEventListener('click', function() {
        if (bgMusic.paused) {
            bgMusic.play();
            toggleMusic.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            bgMusic.pause();
            toggleMusic.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
}

// Função para configurar o controle de música
function setupMusicControl() {
    const bgMusic = document.getElementById('bgMusic');
    const toggleMusic = document.getElementById('toggleMusic');
    
    // Configurar o botão de controle de música
    toggleMusic.addEventListener('click', function() {
        if (bgMusic.paused) {
            bgMusic.play().catch(e => console.log("Reprodução automática bloqueada:", e));
            toggleMusic.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            bgMusic.pause();
            toggleMusic.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
    
    // Garantir que o ícone correto seja exibido no carregamento
    bgMusic.addEventListener('playing', function() {
        toggleMusic.innerHTML = '<i class="fas fa-volume-up"></i>';
    });
    
    bgMusic.addEventListener('pause', function() {
        toggleMusic.innerHTML = '<i class="fas fa-volume-mute"></i>';
    });
}

// Certifique-se de chamar esta função após o carregamento do documento
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    
    // Adicionar ou garantir que esta linha esteja presente
    setupMusicControl();
    
    // ...existing code...
});

// Nova função para inicializar os recursos adicionais
function initializeExtraFeatures() {
    // Inicializar sistema de notas de amor
    if (window.LoveNoteSystem) {
        const loveNotes = new LoveNoteSystem({
            minInterval: 45000,  // 45 segundos
            maxInterval: 120000  // 2 minutos
        });
        loveNotes.init();
    }
    
    // Inicializar caça ao tesouro
    if (window.TreasureHunt) {
        // Atraso para iniciar a caça ao tesouro após a página estar totalmente carregada
        setTimeout(() => {
            const treasureHunt = new TreasureHunt();
            treasureHunt.init();
        }, 2000);
    }
    
    // Inicializar datas especiais
    if (window.SpecialDates) {
        const specialDates = new SpecialDates();
        specialDates.init();
    }
    
    // Inicializar timeline aprimorada
    if (window.RelationshipTimeline) {
        const timeline = new RelationshipTimeline();
        timeline.init();
    }
}

// Adicione uma chamada para esta função no evento DOMContentLoaded principal
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    
    // Inicializar os recursos extras após um pequeno atraso
    setTimeout(initializeExtraFeatures, 1000);
});

// Contador de cliques para Easter Egg do Xiumin
let xiuminClickCount = 0;
const xiuminClickThreshold = 5;

// Função para atualizar a data da carta para o dia atual
function atualizarDataCarta() {
    const cartaConteudo = document.querySelector('.love-letter');
    if (cartaConteudo) {
        const hoje = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dataFormatada = hoje.toLocaleDateString('pt-BR', options);
        
        let texto = cartaConteudo.innerHTML;
        // Substitui a primeira ocorrência de data por hoje
        texto = texto.replace(/\b\d{1,2}\s+de\s+[a-zç]+\s+de\s+\d{4}\b/i, dataFormatada);
        cartaConteudo.innerHTML = texto;
    }
}

// Função para ativar Easter Egg do Xiumin
function setupXiuminEasterEgg() {
    const logo = document.querySelector('.envelope .heart');
    if (logo) {
        logo.addEventListener('click', function(event) {
            event.stopPropagation(); // Evita abrir o envelope
            xiuminClickCount++;
            
            if (xiuminClickCount >= xiuminClickThreshold) {
                // Criar elemento para Easter Egg do Xiumin
                const xiuminEgg = document.createElement('div');
                xiuminEgg.className = 'xiumin-easter-egg';
                xiuminEgg.style.backgroundImage = 'url("images/xiumin.jpg")';
                xiuminEgg.style.position = 'fixed';
                xiuminEgg.style.top = '50%';
                xiuminEgg.style.left = '50%';
                xiuminEgg.style.transform = 'translate(-50%, -50%)';
                xiuminEgg.style.width = '200px';
                xiuminEgg.style.height = '200px';
                xiuminEgg.style.zIndex = '9999';
                
                document.body.appendChild(xiuminEgg);
                
                // Mostrar e esconder após alguns segundos
                setTimeout(() => {
                    xiuminEgg.style.opacity = '1';
                    
                    // Adicionar texto de provocação
                    const xiuminText = document.createElement('div');
                    xiuminText.innerHTML = 'Lembra como eu te provocava com o Xiumin? 😂';
                    xiuminText.style.position = 'fixed';
                    xiuminText.style.top = 'calc(50% + 100px)';
                    xiuminText.style.left = '50%';
                    xiuminText.style.transform = 'translateX(-50%)';
                    xiuminText.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                    xiuminText.style.padding = '10px';
                    xiuminText.style.borderRadius = '5px';
                    xiuminText.style.fontWeight = 'bold';
                    xiuminText.style.color = '#ff6b6b';
                    xiuminText.style.zIndex = '9999';
                    
                    document.body.appendChild(xiuminText);
                    
                    setTimeout(() => {
                        xiuminEgg.style.opacity = '0';
                        xiuminText.style.opacity = '0';
                        setTimeout(() => {
                            document.body.removeChild(xiuminEgg);
                            document.body.removeChild(xiuminText);
                            xiuminClickCount = 0;
                        }, 500);
                    }, 3000);
                }, 100);
            }
        });
    }
}

// Inicializar os recursos
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    
    // Atualizar data da carta para hoje
    atualizarDataCarta();
    
    // Configurar Easter Egg do Xiumin
    setupXiuminEasterEgg();
    
    // ...existing code...
});

// Função para animar a timeline
function setupTimelineAnimation() {
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

// Adicionar a chamada da função no carregamento do documento
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    
    // Animar a timeline quando a página carregar
    setupTimelineAnimation();
});

// Gerenciador da linha do tempo
class TimelineManager {
    constructor() {
        this.events = [];
        this.eventColors = [
            '#ff6b6b', '#ff9e7a', '#ffbe7d', 
            '#ffd97f', '#c5e1a5', '#80deea', 
            '#9fa8da', '#ce93d8'
        ];
        this.setupEventListeners();
        this.loadEvents();
    }
    
    setupEventListeners() {
        // Botão para mostrar formulário
        const showFormBtn = document.getElementById('showTimelineForm');
        if (showFormBtn) {
            showFormBtn.addEventListener('click', () => {
                document.getElementById('timelineForm').style.display = 'block';
                showFormBtn.style.display = 'none';
            });
        }
        
        // Botão para cancelar
        const cancelBtn = document.getElementById('cancelTimelineForm');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                document.getElementById('timelineForm').style.display = 'none';
                document.getElementById('showTimelineForm').style.display = 'inline-flex';
                document.getElementById('addTimelineEvent').reset();
                this.resetIconSelection();
            });
        }
        
        // Seletor de ícones
        const iconOptions = document.querySelectorAll('.icon-option');
        iconOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remover seleção anterior
                document.querySelectorAll('.icon-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                // Adicionar nova seleção
                option.classList.add('selected');
            });
        });
        
        // Formulário de adição de evento
        const form = document.getElementById('addTimelineEvent');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNewEvent();
            });
        }
    }
    
    resetIconSelection() {
        // Resetar seleção de ícones, definindo o primeiro como selecionado
        document.querySelectorAll('.icon-option').forEach((opt, index) => {
            if (index === 0) {
                opt.classList.add('selected');
            } else {
                opt.classList.remove('selected');
            }
        });
    }
    
    addNewEvent() {
        // Coletar dados do formulário
        const title = document.getElementById('eventTitle').value;
        const date = document.getElementById('eventDate').value;
        const time = document.getElementById('eventTime').value || null;
        const description = document.getElementById('eventDescription').value;
        const selectedIcon = document.querySelector('.icon-option.selected')?.getAttribute('data-icon') || 'fa-heart';
        
        // Formatar data para exibição
        const eventDate = new Date(date);
        const formattedDate = eventDate.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        // Criar novo evento
        const newEvent = {
            id: Date.now().toString(), // ID único baseado no timestamp
            title: title,
            date: formattedDate,
            rawDate: date, // Guardar a data bruta para ordenação
            time: time,
            description: description,
            icon: selectedIcon,
            isCustom: true
        };
        
        // Adicionar ao array de eventos
        this.events.push(newEvent);
        
        // Salvar no localStorage
        this.saveEvents();
        
        // Atualizar a linha do tempo
        this.renderEvents();
        
        // Resetar formulário
        document.getElementById('addTimelineEvent').reset();
        document.getElementById('timelineForm').style.display = 'none';
        document.getElementById('showTimelineForm').style.display = 'inline-flex';
        this.resetIconSelection();
        
        // Mostrar mensagem de sucesso
        Swal.fire({
            title: 'Momento Adicionado!',
            text: 'Sua data especial foi adicionada à nossa linha do tempo.',
            icon: 'success',
            confirmButtonColor: '#ff6b6b',
            timer: 3000
        });
    }
    
    loadEvents() {
        // Carregar eventos do localStorage
        const savedEvents = localStorage.getItem('timelineEvents');
        if (savedEvents) {
            try {
                this.events = JSON.parse(savedEvents);
                this.renderEvents();
            } catch (error) {
                console.error('Erro ao carregar eventos da timeline:', error);
                this.events = [];
            }
        }
    }
    
    saveEvents() {
        // Salvar eventos no localStorage
        localStorage.setItem('timelineEvents', JSON.stringify(this.events));
    }
    
    renderEvents() {
        // Selecionar container da timeline
        const timelineContainer = document.querySelector('.enhanced-timeline');
        if (!timelineContainer) return;
        
        // Limpar eventos personalizados existentes
        const customEvents = document.querySelectorAll('.timeline-event.custom');
        customEvents.forEach(event => {
            event.remove();
        });
        
        // Ordenar eventos por data
        const sortedEvents = [...this.events].sort((a, b) => {
            return new Date(a.rawDate) - new Date(b.rawDate);
        });
        
        // Contar eventos existentes para alternar entre esquerda e direita
        const existingEvents = document.querySelectorAll('.timeline-event:not(.custom)').length;
        
        // Adicionar cada evento personalizado
        sortedEvents.forEach((event, index) => {
            const isLeft = (existingEvents + index) % 2 === 0;
            const position = isLeft ? 'left' : 'right';
            
            // Criar o elemento do evento
            const eventElement = document.createElement('div');
            eventElement.className = `timeline-event ${position} custom animate`;
            eventElement.dataset.index = (existingEvents + index).toString();
            
            // Definir conteúdo HTML
            const timeHtml = event.time ? 
                `<span class="timeline-time"><i class="fas fa-clock"></i> ${event.time}</span>` : '';
            
            eventElement.innerHTML = `
                <div class="timeline-dot">
                    <i class="fas ${event.icon}"></i>
                </div>
                <div class="timeline-content">
                    <div class="timeline-date">${event.date} ${timeHtml}</div>
                    <h4 class="timeline-title">${event.title}</h4>
                    <p class="timeline-description">${event.description}</p>
                    <button class="timeline-delete-btn" data-id="${event.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            
            // Adicionar à timeline
            timelineContainer.appendChild(eventElement);
            
            // Adicionar evento para excluir
            const deleteBtn = eventElement.querySelector('.timeline-delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteEvent(event.id);
                });
            }
        });
        
        // Configurar animação
        setTimeout(() => {
            setupTimelineAnimation();
        }, 100);
    }
    
    deleteEvent(id) {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Esta data será removida da linha do tempo",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff6b6b',
            cancelButtonColor: '#999',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Filtrar o evento a ser removido
                this.events = this.events.filter(event => event.id !== id);
                
                // Salvar e renderizar
                this.saveEvents();
                this.renderEvents();
                
                Swal.fire(
                    'Excluído!',
                    'A data foi removida da linha do tempo.',
                    'success'
                );
            }
        });
    }
}

// Inicializar o gerenciador de timeline após o DOM estar carregado
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    
    // Inicializar o gerenciador de timeline
    const timelineManager = new TimelineManager();
    
    // ...existing code...
});
