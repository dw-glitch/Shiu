// Sistema de Notas de Amor - Mensagens carinhosas que aparecem aleatoriamente

const loveNotes = [
    "Cada vez que sorrio, é porque penso em você",
    "Meu coração dispara toda vez que te vejo",
    "Você é a razão do meu sorriso todos os dias",
    "Eu amo seu jeito de olhar o mundo",
    "Você é a melhor parte do meu dia, todos os dias",
    "Conhecer você foi o destino, mas me apaixonar foi escolha",
    "Sou grato todos os dias por ter você na minha vida",
    "Nada é impossível quando estou ao seu lado",
    "Seu sorriso ilumina meu mundo",
    "Você é meu lugar favorito para onde sempre quero voltar",
    "Obrigado por me fazer sentir amado todos os dias",
    "Você torna todos os dias especiais",
    "Cada momento com você é um tesouro para mim",
    "Eu te amo mais do que as palavras podem expressar",
    "Você me faz querer ser uma pessoa melhor a cada dia"
];

class LoveNoteSystem {
    constructor(options = {}) {
        this.minInterval = options.minInterval || 60000; // 1 minuto
        this.maxInterval = options.maxInterval || 180000; // 3 minutos
        this.activeNote = null;
        this.timeoutId = null;
    }

    init() {
        this.scheduleNextNote();
        
        // Também mostra uma nota imediatamente após 10 segundos de uso
        setTimeout(() => this.showRandomNote(), 10000);
    }

    scheduleNextNote() {
        const nextInterval = Math.floor(Math.random() * 
            (this.maxInterval - this.minInterval) + this.minInterval);
        
        this.timeoutId = setTimeout(() => {
            this.showRandomNote();
            this.scheduleNextNote();
        }, nextInterval);
    }

    showRandomNote() {
        // Não mostrar se já existe uma nota ativa
        if (this.activeNote) return;
        
        const note = loveNotes[Math.floor(Math.random() * loveNotes.length)];
        
        // Criar elemento de nota
        const noteElement = document.createElement('div');
        noteElement.className = 'love-note';
        noteElement.innerHTML = `
            <div class="love-note-content">
                <i class="fas fa-heart love-note-icon"></i>
                <p>${note}</p>
                <button class="love-note-close"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Adicionar ao corpo do documento
        document.body.appendChild(noteElement);
        this.activeNote = noteElement;
        
        // Mostrar com animação
        setTimeout(() => {
            noteElement.classList.add('visible');
        }, 100);
        
        // Configurar botão de fechar
        const closeButton = noteElement.querySelector('.love-note-close');
        closeButton.addEventListener('click', () => {
            this.closeNote(noteElement);
        });
        
        // Auto-fechar após 10 segundos
        setTimeout(() => {
            if (this.activeNote === noteElement) {
                this.closeNote(noteElement);
            }
        }, 10000);
    }

    closeNote(noteElement) {
        noteElement.classList.remove('visible');
        setTimeout(() => {
            if (document.body.contains(noteElement)) {
                document.body.removeChild(noteElement);
            }
            this.activeNote = null;
        }, 500);
    }

    stop() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
}

// Exportar para uso global
window.LoveNoteSystem = LoveNoteSystem;
