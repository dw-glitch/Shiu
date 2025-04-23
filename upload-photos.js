// Sistema de gerenciamento de fotos com persistência

class PhotoManager {
    constructor(gallerySelector) {
        this.gallerySelector = gallerySelector;
        this.gallery = document.querySelector(gallerySelector);
        this.photos = [];
        this.currentIndex = 0;
        this.loadPhotos();
    }
    
    init() {
        // Criar container de upload
        const uploadContainer = document.createElement('div');
        uploadContainer.className = 'photo-upload-container';
        uploadContainer.innerHTML = `
            <h4>Adicionar Novas Fotos</h4>
            <label class="photo-upload-label">
                <i class="fas fa-camera"></i> Escolher Fotos
                <input type="file" class="photo-upload-input" accept="image/*" multiple>
            </label>
            <div class="photo-preview-container"></div>
        `;
        
        // Inserir antes da galeria
        if (this.gallery && this.gallery.parentNode) {
            this.gallery.parentNode.insertBefore(uploadContainer, this.gallery);
        }
        
        // Configurar eventos
        const fileInput = uploadContainer.querySelector('.photo-upload-input');
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Adicionar botões de exclusão nas fotos existentes
        this.setupExistingPhotosForDeletion();
    }
    
    setupExistingPhotosForDeletion() {
        const existingPhotos = document.querySelectorAll(`${this.gallerySelector} .photo`);
        existingPhotos.forEach((photo, index) => {
            // Adicionar ID se não tiver
            if (!photo.id) {
                photo.id = `photo-${Date.now()}-${index}`;
            }
            
            // Verificar se já tem botão de exclusão
            let deleteBtn = photo.querySelector('.photo-delete-btn');
            if (!deleteBtn) {
                deleteBtn = document.createElement('button');
                deleteBtn.className = 'photo-delete-btn';
                deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
                photo.appendChild(deleteBtn);
                
                // Adicionar evento de clique
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Evitar abrir o modal
                    this.deletePhoto(photo.id);
                });
            }
        });
    }
    
    handleFileSelect(event) {
        const files = event.target.files;
        const previewContainer = document.querySelector('.photo-preview-container');
        
        if (files.length > 0) {
            // Limpar previews anteriores
            previewContainer.innerHTML = '';
            
            // Para cada arquivo
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    const photoId = `new-photo-${Date.now()}-${i}`;
                    
                    // Criar elemento de preview
                    const previewItem = document.createElement('div');
                    previewItem.className = 'photo-preview-item';
                    previewItem.dataset.id = photoId;
                    
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" class="photo-preview">
                        <input type="text" class="photo-caption-input" placeholder="Adicionar legenda...">
                        <button class="photo-remove-preview-btn"><i class="fas fa-times"></i></button>
                    `;
                    
                    previewContainer.appendChild(previewItem);
                    
                    // Adicionar evento para remover preview
                    const removeBtn = previewItem.querySelector('.photo-remove-preview-btn');
                    removeBtn.addEventListener('click', () => {
                        previewItem.remove();
                        this.checkToShowSubmitButton();
                    });
                    
                    this.checkToShowSubmitButton();
                };
                
                reader.readAsDataURL(file);
            }
        }
    }
    
    checkToShowSubmitButton() {
        const previewContainer = document.querySelector('.photo-preview-container');
        const existingBtn = document.querySelector('.photo-submit-btn');
        
        if (previewContainer.children.length > 0 && !existingBtn) {
            // Criar botão de envio
            const submitBtn = document.createElement('button');
            submitBtn.className = 'photo-submit-btn';
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Adicionar à Galeria';
            
            submitBtn.addEventListener('click', () => this.saveNewPhotos());
            
            // Adicionar ao container
            const uploadContainer = document.querySelector('.photo-upload-container');
            if (uploadContainer) {
                uploadContainer.appendChild(submitBtn);
            }
        } else if (previewContainer.children.length === 0 && existingBtn) {
            // Remover botão se não houver previews
            existingBtn.remove();
        }
    }
    
    saveNewPhotos() {
        const previewItems = document.querySelectorAll('.photo-preview-item');
        
        previewItems.forEach((item, index) => {
            const imgSrc = item.querySelector('.photo-preview').src;
            const caption = item.querySelector('.photo-caption-input').value || `Nossa foto #${this.getNextPhotoIndex()}`;
            
            // Criar novo elemento de foto
            const photoElement = document.createElement('div');
            photoElement.className = 'photo';
            photoElement.id = `photo-${Date.now()}-${index}`;
            photoElement.style.backgroundImage = `url(${imgSrc})`;
            photoElement.setAttribute('data-index', this.getNextPhotoIndex());
            
            photoElement.innerHTML = `
                <div class="caption">${caption}</div>
                <div class="fullscreen-icon"><i class="fas fa-expand"></i></div>
                <button class="photo-delete-btn"><i class="fas fa-trash"></i></button>
            `;
            
            // Adicionar à galeria
            this.gallery.appendChild(photoElement);
            
            // Configurar evento de clique para abrir modal
            photoElement.addEventListener('click', function(e) {
                if (e.target.closest('.photo-delete-btn')) return;
                
                const modal = document.getElementById('photoModal');
                const modalImg = document.getElementById('modalImage');
                const modalCaption = modal.querySelector('.modal-caption');
                
                modalImg.src = imgSrc;
                modalCaption.textContent = caption;
                
                modal.style.display = 'block';
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
            
            // Configurar evento para o botão de exclusão
            const deleteBtn = photoElement.querySelector('.photo-delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deletePhoto(photoElement.id);
            });
            
            // Adicionar ao array para persistência
            this.photos.push({
                id: photoElement.id,
                src: imgSrc,
                caption: caption,
                index: this.getNextPhotoIndex() - 1
            });
        });
        
        // Salvar no localStorage
        this.savePhotos();
        
        // Limpar previews e remover botão de envio
        document.querySelector('.photo-preview-container').innerHTML = '';
        const submitBtn = document.querySelector('.photo-submit-btn');
        if (submitBtn) submitBtn.remove();
        
        // Mostrar mensagem de sucesso
        Swal.fire({
            title: 'Fotos Adicionadas!',
            text: `${previewItems.length} fotos foram adicionadas à galeria.`,
            icon: 'success',
            confirmButtonColor: '#ff6b6b',
            timer: 3000
        });
        
        // Atualizar o índice máximo
        this.updatePhotoIndices();
        
        // Atualizar a visualização da galeria
        this.setupGalleryModal();
    }
    
    deletePhoto(photoId) {
        Swal.fire({
            title: 'Tem certeza?',
            text: 'Esta foto será removida da galeria',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff6b6b',
            cancelButtonColor: '#999',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Remover do DOM
                const photoElement = document.getElementById(photoId);
                if (photoElement) {
                    photoElement.remove();
                }
                
                // Remover do array
                this.photos = this.photos.filter(photo => photo.id !== photoId);
                
                // Salvar no localStorage
                this.savePhotos();
                
                // Atualizar índices
                this.updatePhotoIndices();
                
                // Atualizar a visualização da galeria
                this.setupGalleryModal();
                
                Swal.fire(
                    'Excluída!',
                    'A foto foi removida da galeria.',
                    'success'
                );
            }
        });
    }
    
    getNextPhotoIndex() {
        // Encontrar o maior índice atual
        let maxIndex = -1;
        document.querySelectorAll(`${this.gallerySelector} .photo`).forEach(photo => {
            const index = parseInt(photo.getAttribute('data-index') || '0');
            if (index > maxIndex) maxIndex = index;
        });
        
        // Retornar o próximo índice
        return maxIndex + 1;
    }
    
    updatePhotoIndices() {
        // Atualizar índices sequencialmente
        const photos = document.querySelectorAll(`${this.gallerySelector} .photo`);
        photos.forEach((photo, index) => {
            photo.setAttribute('data-index', index.toString());
        });
    }
    
    loadPhotos() {
        // Carregar fotos do localStorage
        const savedPhotos = localStorage.getItem('galleryPhotos');
        if (savedPhotos) {
            try {
                this.photos = JSON.parse(savedPhotos);
                
                // Restaurar as fotos na galeria
                this.photos.forEach(photo => {
                    // Criar novo elemento de foto
                    const photoElement = document.createElement('div');
                    photoElement.className = 'photo';
                    photoElement.id = photo.id;
                    photoElement.style.backgroundImage = `url(${photo.src})`;
                    photoElement.setAttribute('data-index', photo.index);
                    
                    photoElement.innerHTML = `
                        <div class="caption">${photo.caption}</div>
                        <div class="fullscreen-icon"><i class="fas fa-expand"></i></div>
                        <button class="photo-delete-btn"><i class="fas fa-trash"></i></button>
                    `;
                    
                    // Adicionar à galeria
                    if (this.gallery) {
                        this.gallery.appendChild(photoElement);
                    }
                    
                    // Configurar evento de clique para abrir modal
                    photoElement.addEventListener('click', function(e) {
                        if (e.target.closest('.photo-delete-btn')) return;
                        
                        const modal = document.getElementById('photoModal');
                        const modalImg = document.getElementById('modalImage');
                        const modalCaption = modal.querySelector('.modal-caption');
                        
                        modalImg.src = photo.src;
                        modalCaption.textContent = photo.caption;
                        
                        modal.style.display = 'block';
                        modal.classList.add('show');
                        document.body.style.overflow = 'hidden';
                    });
                    
                    // Configurar evento para o botão de exclusão
                    const deleteBtn = photoElement.querySelector('.photo-delete-btn');
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.deletePhoto(photoElement.id);
                    });
                });
                
                // Configurar visualização em modal
                this.setupGalleryModal();
            } catch (error) {
                console.error('Erro ao carregar fotos:', error);
                this.photos = [];
            }
        }
    }
    
    savePhotos() {
        // Salvar fotos no localStorage
        localStorage.setItem('galleryPhotos', JSON.stringify(this.photos));
    }
    
    setupGalleryModal() {
        const photos = document.querySelectorAll(`${this.gallerySelector} .photo`);
        const modal = document.getElementById('photoModal');
        const modalImg = document.getElementById('modalImage');
        const modalCaption = modal.querySelector('.modal-caption');
        const prevBtn = document.getElementById('prevPhoto');
        const nextBtn = document.getElementById('nextPhoto');
        const closeBtn = modal.querySelector('.close-modal');
        
        // Fechar modal
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
        
        // Clicar fora do modal para fechar
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Navegação entre fotos
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navigatePhotos('prev');
        });
        
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navigatePhotos('next');
        });
        
        // Navegação com teclado
        document.addEventListener('keydown', function(e) {
            if (modal.style.display === 'block') {
                if (e.key === 'ArrowLeft') {
                    navigatePhotos('prev');
                } else if (e.key === 'ArrowRight') {
                    navigatePhotos('next');
                } else if (e.key === 'Escape') {
                    modal.style.display = 'none';
                    modal.classList.remove('show');
                    document.body.style.overflow = 'auto';
                }
            }
        });
        
        function navigatePhotos(direction) {
            // Encontrar foto ativa atual
            let currentIndex = 0;
            const currentSrc = modalImg.src;
            
            photos.forEach((photo, index) => {
                const photoSrc = photo.style.backgroundImage.slice(4, -1).replace(/["']/g, "");
                if (photoSrc === currentSrc || photo.getAttribute('data-index') == currentIndex) {
                    currentIndex = index;
                }
            });
            
            // Calcular próximo índice
            let nextIndex;
            if (direction === 'prev') {
                nextIndex = (currentIndex - 1 + photos.length) % photos.length;
            } else {
                nextIndex = (currentIndex + 1) % photos.length;
            }
            
            // Atualizar modal
            const nextPhoto = photos[nextIndex];
            const nextSrc = nextPhoto.style.backgroundImage.slice(4, -1).replace(/["']/g, "");
            const nextCaption = nextPhoto.querySelector('.caption').textContent;
            
            modalImg.src = nextSrc;
            modalCaption.textContent = nextCaption;
        }
    }
}

// Inicializar quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    const photoManager = new PhotoManager('.gallery');
    photoManager.init();
});
