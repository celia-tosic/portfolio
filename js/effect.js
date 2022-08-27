const effect = {
    init: function () {
        console.log('effect module loading');

        effect.photo = document.querySelector(".photo");
        effect.name = document.querySelector(".header-description__title--underline");
        console.log(effect.name);

        effect.name.addEventListener("mouseover", effect.show);
    },

    show:function(){
        effect.photo.classList.add('show');

    },

    hide:function(){
        effect.photo.classList.remove('show');

    }
}