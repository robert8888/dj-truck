(function () {
    function setSizeProperty(){
        const vh = window.innerHeight * 0.01;
        const vw = window.innerWidth * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.documentElement.style.setProperty('--vw', `${vw}px`);
    }

    function pixelRatio(){
        document.documentElement.style.setProperty('--pixelRatio', window.devicePixelRatio);
    }

    setSizeProperty();
    pixelRatio();
    window.addEventListener('resize', () => {
        setSizeProperty();
    })
})()

