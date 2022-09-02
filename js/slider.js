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

    ImagesRelatedToTheSlider(event){

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

    handlePreviousButtonClick:function(event){

        //On récupère le résultat de la fonction ImagesRelatedToTheSlider() (donc les images du slider) dans une variable slideList
        const slideList = slider.ImagesRelatedToTheSlider(event);
         
        //On passe en paramètre des différentes fonction les images récupérées.
        slider.hideSlide(slider.currentSlideIndex, slideList);
        slider.moveToPreviousSlide(slideList);
        slider.showSlide(slider.currentSlideIndex, slideList);

    },

    handleNextButtonClick:function(event){
         
        const slideList = slider.ImagesRelatedToTheSlider(event);
        
        slider.hideSlide(slider.currentSlideIndex, slideList);
        slider.moveToNextSlide(slideList);
        slider.showSlide(slider.currentSlideIndex, slideList);

   },


    //4. On définit les fonctions 
    hideSlide: function(slideIndexToHide, slideList)
    {
        console.log(slideList);
        // on veut récupérer la slide qui est à l'index slideIndexToHide
       slideList[slideIndexToHide].classList.remove('slider__img--current');
    },

    moveToPreviousSlide: function(slideList)
    {

        if(slider.currentSlideIndex === 0)
        {
            // si on est sur la première slide on change la valeur de currentSlide à la dernière slide
            slider.currentSlideIndex = slideList.length - 1;
        }
        else {
            // sinon on decrémente sa valeur
            slider.currentSlideIndex--;
        }
    },

    moveToNextSlide: function(slideList)
    {
       
        if(slider.currentSlideIndex === slideList.length - 1)
        {
            // si on est sur la dernière slide on change la valeur de currentSlide à 0
            slider.currentSlideIndex = 0;
        }
        else {
            // sinon on incrémente sa valeur
            slider.currentSlideIndex++;
        }
    },

    showSlide: function(slideIndexToShow, slideList)
    {
        slideList[slideIndexToShow].classList.add('slider__img--current');
    },

}