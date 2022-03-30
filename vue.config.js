//  共享全局变量 -- vue-cli / 指南 / css / 向预处理器loader传递配置项
module.exports = {
    css: {
        loaderOptions: {
            scss: {
                //additionalDate 在webpack读取入口文件代码时，webpack读取到了scss就会自动添加对应scss文件的引入
                prependData: `@import "~@/styles/variables.scss";`
                //scss 要求有;
            },
        }
    }
}