const slider = {
    currentSlideIndex: 0,
    slideList: null,
    init: function () {
        console.log('slider module loading ...');
        
        // 3. on récupère toutes les slides dans notre module
        slider.slideList = document.querySelectorAll('.slider__img');

        // 1. On récupére les 2 boutons pour leur ajouter un écouteur d'événement click
        const buttonsPrevious = document.querySelectorAll('.btn-previous');
        const buttonsNext = document.querySelectorAll('.btn-next');
        console.log(buttonsPrevious);
        console.log(buttonsNext);
       
        //Au moment du clic sur ces boutons (gauche ou droite), des fonctions sont exécutées

        for(const buttonPrevious of buttonsPrevious){
            buttonPrevious.addEventListener('click', slider.handleLeftButtonClick);   
        };

        for(const buttonNext of buttonsNext){
            buttonNext.addEventListener('click', slider.handleRightButtonClick);

        };
        

    },

    //2. On définit la fonction handleLeftButtonCLick et handleRightButtonClick. Ces fonctions appellent plusieurs fonctions 
    handleLeftButtonClick: function ()
    {
        slider.hideSlide(slider.currentSlideIndex);
        slider.moveToPreviousSlide();
        slider.showSlide(slider.currentSlideIndex);

    },

    handleRightButtonClick: function ()
    {
        slider.hideSlide(slider.currentSlideIndex);
        slider.moveToNextSlide();
        slider.showSlide(slider.currentSlideIndex);
    },

    //4. On définit les fonctions 
    hideSlide: function(slideIndexToHide)
    {
        // on veut récupérer la slide qui est à l'index slideIndexToHide
        slider.slideList[slideIndexToHide].classList.remove('slider__img--current');
    },

    moveToNextSlide: function()
    {
        if(slider.currentSlideIndex === slider.slideList.length - 1)
        {
            // si on est sur la dernière slide on change la valeur de currentSlide à 0
            slider.currentSlideIndex = 0;
        }
        else {
            // sinon on incrémente sa valeur
            slider.currentSlideIndex++;
        }
    },

    moveToPreviousSlide: function()
    {
        if(slider.currentSlideIndex === 0)
        {
            // si on est sur la première slide on change la valeur de currentSlide à la dernière slide
            slider.currentSlideIndex = slider.slideList.length - 1;
        }
        else {
            // sinon on decrémente sa valeur
            slider.currentSlideIndex--;
        }
    },

    showSlide: function(slideIndexToShow)
    {
        slider.slideList[slideIndexToShow].classList.add('slider__img--current');
    },

}

