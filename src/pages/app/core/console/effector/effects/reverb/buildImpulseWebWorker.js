
export default () => {
    self.addEventListener("message", e => {/* eslint-disable-line no-restricted-globals */
      if (!e) {
          return;
      }

      if(e.data[0].type === "BUILD_IMPULSE"){
        _buildImpulse(
            e.data[0].length,
            e.data[0].decay,
            e.data[0].reverse,
            e.data[1],
            e.data[2]
        )
      }
    });

    function _buildImpulse(length, decay, reverse, impulseL, impulseR) {
        let n, i;

        for (i = 0; i < length; i++) {
            n = reverse ? length - i : i;
            impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
            impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
        }

        postMessage([{type:"IMPLUSE", length}, impulseL , impulseR])
    }

  };