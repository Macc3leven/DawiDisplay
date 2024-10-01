function addKeyboardControl(object) {
    document.addEventListener("keydown", function (event) {
        // console.log(event.key)
        switch (event.key) {
            
            case "a": // left
                object.a();
                break;
            case "d": // right
                object.d();
                break;
            case "w": // forward
                object.w();
                break;
            case "s": // back
                object.s();
                break;
            case "q": // up
                object.q();
                break;
            case "e": // down
                object.e();
                break;
            case " ": // space
                object.space();
                break;
        }
    });
}

export default addKeyboardControl;
