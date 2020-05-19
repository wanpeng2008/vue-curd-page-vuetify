import ConfigurableComponent from './src/ConfigurableComponent.vue'
ConfigurableComponent.install = function (Vue) {
    Vue.component(ConfigurableComponent.name, ConfigurableComponent)
}
export default ConfigurableComponent