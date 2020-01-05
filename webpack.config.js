//webpack은 100% frontend tool이기 때문에 babel이 적용이 안된다. plain-old JS를 사용해야 함.
//path는 NodeJS에 기본적으로 내장되어있는 패키지로, 절대경로를 얻는데 사용된다.

const path = require("path");
const autoprefixer = require("autoprefixer");
const ExtractCSS = require("extract-text-webpack-plugin");

const MODE = process.env.WEBPACK_ENV;
const ENTRY_FILE =path.resolve(__dirname,"assets","js","main.js");
const OUTPUT_DIR = path.join(__dirname,"static");

const config = {
    entry: ["@babel/polyfill", ENTRY_FILE],
    mode: MODE,
    module:{
        rules:[
            {
                test:/\.(js)$/,
                use:[
                    {
                        loader:"babel-loader"
                    }
                ]
            },
            {
                test:/\.(scss)$/,
                use: ExtractCSS.extract([
                    {
                        loader:"css-loader" // 3) 이 로더에 의해서 webpack은 css를 이해할 수 있게 된다.
                    },
                    {
                        loader:"postcss-loader",// 2) css를 받아서 호환성을 해결해준다.
                        options:{
                            plugins(){
                                return [autoprefixer({browsers:"cover 99.5%"})];
                            }
                        }
                    },
                    {
                        loader:"sass-loader" // 1) sass를 css로 변환해준다.
                    }
                ])
            }
        ]
    },
    output: {
        path: OUTPUT_DIR,
        filename: "[name].js"
    },
    plugins:[new ExtractCSS("styles.css")]
};

module.exports = config;