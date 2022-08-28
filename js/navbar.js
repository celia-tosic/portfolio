const navbar = {
    init: function () {
        console.log('navbar module loading');

        //On cible le menu burger et la barre de navigation
        navbar.burger = document.querySelector("#header-burger");
        navbar.nav = document.querySelector("#nav");

        //On cible la croix
        navbar.cross =document.querySelector("#header-cross");

        //On écoute le clic sur le burger menu
        navbar.burger.addEventListener("click", navbar.show);
        navbar.cross.addEventListener("click", navbar.removeSideBar);


    },

    show: function(){
        navbar.burger.classList.add("active");
        navbar.nav.classList.add("active");
        setTimeout(function(){
            navbar.cross.classList.add("active")}, 800);
    },

    //Enlève la classe active à la navbar pour la faire disparaître lorqu'on clique sur les liens du menu
    removeSideBar: function(){
        navbar.nav.classList.remove("active");
        navbar.cross.classList.remove("active");
        setTimeout(function(){
            navbar.burger.classList.remove("active")}, 800);
    },
}