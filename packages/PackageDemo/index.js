import PackageDemo from './src/PackageDemo.vue'
PackageDemo.install = function (Vue) {
    Vue.component(PackageDemo.name, PackageDemo)
}
export default PackageDemo