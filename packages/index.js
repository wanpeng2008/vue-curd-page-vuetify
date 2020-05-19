import ConfigurableComponent from './ConfigurableComponent/index'
import PackageDemo from './PackageDemo/index'
import CurdPage from './CurdPage/index'

const components = [
    ConfigurableComponent,
    PackageDemo,
    CurdPage,
]

const install = function (Vue) {
    if (install.installed) {
        return
    }
    install.installed = true;
    components.forEach(component => {
        Vue.component(component.name, component)
    })
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install,
    ...components
}