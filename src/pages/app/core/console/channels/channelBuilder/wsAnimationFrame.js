export function addAnimationFrame(waveSurfer){



    

    waveSurfer.drawer.progress = function (progress) {
        var minPxDelta = 1 / this.params.pixelRatio;
        var pos = Math.round(progress * this.width) * minPxDelta;

        if (pos < this.lastPos || pos - this.lastPos >= minPxDelta) {
            this.lastPos = pos;

        this.recenterOnPosition(pos);
            if (this.params.scrollParent && this.params.autoCenter)
            {
                var newPos = ~~(this.wrapper.scrollWidth * progress);
                //console.log(this._recenterAndUpdate(pos, newPos))
               // window.requestAnimationFrame(this._recenterAndUpdate.bind(this, pos, newPos))
            } else {
              //  this.updateProgress(pos);
            }
        }
    }

    waveSurfer.drawer._recenterAndUpdate = function(pos, newPos){
        this.recenterOnPosition(newPos);
        //this.updateProgress(pos)
    }

    waveSurfer.drawer._mainWS = waveSurfer.drawer.container.firstChild;
    waveSurfer.drawer._mainWS.style.position = "absolute"

    waveSurfer.drawer.recenterOnPosition = function (position, immediate) {
        
        var scrollLeft = this._scrollLeft;
        var half = ~~(this.container / 2);
        console.log("half", half)
        var target = position - half;
        var offset = target - scrollLeft;
        var maxScroll = this._mainWS.clientWidth - this.wrapper.clientWidth;

     /*   if (maxScroll == 0) {
            // no need to continue if scrollbar is not there
            return;
        }*/

        // if the cursor is currently visible...
        if (!immediate && -half <= offset && offset < half) {
            // we'll limit the "re-center" rate.
            var rate = 5;
            offset = Math.max(-rate, Math.min(rate, offset));
            target = scrollLeft + offset;
        }

        // limit target to valid range (0 to maxScroll)
       // target = Math.max(0, Math.min(maxScroll, target));
        // no use attempting to scroll if we're not moving
 //       if (target != scrollLeft) {
            this._scrollLeft = target;
            //console.log(target)
            this._mainWS.style.transform = "translateX(" + -target + "px)";
       // }

    }
}