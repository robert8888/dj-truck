export default () => {
    self.addEventListener("message", e => {/* eslint-disable-line no-restricted-globals */
        console.log('in worker get message', e)
        if (!e || !(e.data[0] instanceof Array)) {
            return;
        }
        const peaks = e.data[0]

        console.log("in send back peaks")
        interpolate(peaks).then(peaks => postMessage([peaks]))
        //setTimeout(()=>postMessage([peaks]), 2000);
    })
    //simple iterpolate by const factor
    //output is between 1000 and 2000 element 
    //input arry is kind of heap. includes min max piars. where n-max element 
    //have index 2n and min 2n + 1 

    //--corect it was supposedto be interpolation but just
    // peaking evry n'th element of input has better effect

    async function interpolate(input) {
        let output = [];
        const targetBoundry = {
            max: 2000,
            min: 1000,
        }
        const inputSize = input.length;

        if (inputSize < targetBoundry.min) {
            return input;
        }

        const ratio = Math.floor(inputSize / targetBoundry.max);
        const outputSize = Math.ceil(inputSize / ratio) ;

        for (let i = 0; i < outputSize / 2; i++) {
            // for(let m of [0, 1]){ // min max
            //     // let avg = 0;
            //     // let r;
            //     // for (r = 0; r < ratio; r++) {
            //     //     const index = 2 * (i * ratio + r) + m ;
            //     //     if(index > inputSize)
            //     //         break;
            //     //     avg += input[index];
            //     // }

            //     //output[2 * i + m] = avg / r;
            //     output[2 * i + m] = input[2 * (i * ratio) + m];
            // }
            output[2 * i ] = input[2 * (i * ratio) ];
            output[2 * i + 1] = input[(2 * (i * ratio)) + 1];

        }
        // console.log("input ", input)
        // console.log("outpout", output);

        return output;
    }
}