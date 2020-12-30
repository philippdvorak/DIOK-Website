export default {
    build: {
        analyze: true,
        extend(config) {
            config.resolve.alias['vue'] = 'vue/dist/vue.common'
        },
        transpile: [
            "gsap"
        ]
    },
    server :{
      port: 3000, //Build change to 80
      host: "0.0.0.0"
    },
    buildDir: 'nuxt-dist',
    css: [
        '@/assets/style/style.scss',
        '@/assets/style/variable.scss',
    ],
    head() {
        return {
            htmlAttrs: {
                lang: 'de'
            },
            title: "OKAY Ybbs",
            meta: [
                {
                    hid: "viewport",
                    name: "viewport",
                    content: "width=device-width, initial-scale=1"
                },
                {
                    charset: 'utf-8',
                    hid: 'charset'
                },
                {
                    hid: "keywords",
                    name: "keywords",
                    content: "OKAY, Offene Kultur aus Ybbs, Ybbs an der Donau, Kultur, Kulturveranstaltung, Ybbs, Kultur, Kultuverein"
                }
            ],
            link: [
                {
                    rel: "icon",
                    type: "image/svg+xml",
                    ref:"/favicon.svg"
                }
            ],
            script: [
                {
                    src: "https://players.yumpu.com/modules/embed/yp_r_iframe.js"
                }
            ]
        }
    },
    modules: [
        'vue-scrollto/nuxt'
    ],
    //loading: "~/components/loading/loading.vue"
}
