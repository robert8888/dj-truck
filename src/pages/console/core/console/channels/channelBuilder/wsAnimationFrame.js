export function addAnimationFrame(waveSurfer){



    

    waveSurfer.drawer.progress = function (progress){
        var minPxDelta = 1 / this.params.pixelRatio;
        var pos = Math.round(progress * this.width) * minPxDelta;

        if (pos < this.lastPos || pos - this.lastPos >= minPxDelta) {
            this.lastPos = pos;

            if (this.params.scrollParent && this.params.autoCenter) {
                var newPos = ~~(this.wrapper._scrollWidth * progress);
                this.recenterOnPosition(newPos);
            }

            this.updateProgress(pos);
        }
    }


    waveSurfer.drawer._measureDimensions = function(){
      //  console.log("dimension measured")
        this.wrapper._clientWidth = this.wrapper.clientWidth;
        this.wrapper._scrollWidth = this.wrapper.scrollWidth;
    }

    waveSurfer.drawer.recenterOnPosition= function(position, immediate) {
        var scrollLeft = this.wrapper._scrollLeft;
        var half = ~~(this.wrapper._clientWidth / 2);
        var target = position - half;
        var offset = target - scrollLeft;
        var maxScroll = this.wrapper._scrollWidth - this.wrapper._clientWidth;

        if (maxScroll === 0) {
            // no need to continue if scrollbar is not there
            return;
        }

        // if the cursor is currently visible...
        if (!immediate && -half <= offset && offset < half) {
            // we'll limit the "re-center" rate.
            var rate = 5;
            offset = Math.max(-rate, Math.min(rate, offset));
            target = scrollLeft + offset;
        }

        // limit target to valid range (0 to maxScroll)
        target = Math.max(0, Math.min(maxScroll, target));
        // no use attempting to scroll if we're not moving
        if (target !== scrollLeft) {
            this.wrapper.scrollLeft = target;
          //this.wrapper.style.left = -target+"px";
            this.wrapper._scrollLeft = target;
        }

    }
}