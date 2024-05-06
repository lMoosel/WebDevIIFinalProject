import mutations  from "./mutations.js";
import queries  from "./queries.js";

const exported = {}

Object.keys(mutations).map((key) => {
    exported[key] = mutations[key]
})
Object.keys(queries).map((key) => {
    exported[key] = queries[key]
})

export default exported