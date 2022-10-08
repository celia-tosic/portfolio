const slider = {
    currentSlideIndex: 0,
    slideList: null,
    init: function () {
        console.log('slider module loading ...');

        // 1. On récupére les 2 boutons pour leur ajouter un écouteur d'événement click
        const buttonsPrevious = document.querySelectorAll('.btn-previous');
        const buttonsNext = document.querySelectorAll('.btn-next');
       
        //Au moment du clic sur ces boutons (gauche ou droite), des fonctions sont exécutées

        for(const buttonPrevious of buttonsPrevious){
            buttonPrevious.addEventListener('click', slider.handlePreviousButtonClick);      
        };

        for(const buttonNext of buttonsNext){
            buttonNext.addEventListener('click', slider.handleNextButtonClick);      
        };

    },

    imagesRelatedToTheSlider(event){

        //On récupère le bouton sur lequel on a cliqué 
        const child = event.target;
        //On remonte jusqu'à son parent (la div avec la classe .buttons)
        const div = child.parentNode;
        //On remonte jusqu'au parent de la div
        const parent = div.parentNode;
        //On récupère les classes du parent
        const parentClasses = parent.classList;
        //On récupère la classe qui différencie chaque slider
        const classe = parentClasses[1];
        //On met le selecteur dans une variable
        const selector = '.' + classe + '> .slider__img';
        //On récupère les images associées au slider en question
        const slideListImages = document.querySelectorAll(selector);

        return slideListImages;
    },

    hideSlide:function(image){
        image.classList.remove('slider__img--current');
    },

    showSlide:function(image){
        image.classList.add('slider__img--current');
    },


    handleNextButtonClick:function(event){

        const slideList = slider.imagesRelatedToTheSlider(event);

        //Pour chaque image (image) et index (i) de la liste d'images récupérée (slideList) 
        for(const [i, image] of slideList.entries()){
            
            //Si l'image contient la classe slider__img--current
            if(image.classList.contains('slider__img--current')){
                //Si on est sur la dernière image (donc si l'index est égal à la longueur de la liste-1) (et que la suivante est la première)
                if (i === slideList.length - 1){
                    //On lui enlève la classe current
                    slider.hideSlide(image);
                    //Et on ajoute la classe current à la première image pour la rendre visible
                    slideList[0].classList.add('slider__img--current');
                    //L'instruction break permet d'arrêter la boucle
                    break;
                }else{
                    //Si nous ne sommes pas sur la dernière image, alors on lui enlève simplement la classe current 
                    slider.hideSlide(image);
                    //Et on rend visible la slide suivante.
                    slider.showSlide(slideList[i+1]);
                    break;
                };
            }
        };
    },

    handlePreviousButtonClick:function(event){

        //On récupère le résultat de la fonction ImagesRelatedToTheSlider() (donc les images du slider) dans une variable slideList
        const slideList = slider.imagesRelatedToTheSlider(event);
         
         //Pour chaque image (image) et index (i) de la liste d'images récupérée (slideList) 
         for(const [i, image] of slideList.entries()){

            //Si l'image contient la classe slider__img--current
            if(image.classList.contains('slider__img--current')){
                //Si on est sur la première image
                if (i === 0){
                    console.log(i, image);
                    //On lui enlève la classe current
                    slider.hideSlide(image);
                    //Et on ajoute la classe current à la dernière image 
                    slideList[slideList.length - 1].classList.add('slider__img--current');
                    break;
                // Si on n'est pas sur la première image, on enlève simplement la classe current à l'image actuelle et on rend visible la précédente.
                 }else{
                    slider.hideSlide(image);
                    slider.showSlide(slideList[i-1]);
                    break;
                };
            };
        };
    },
};