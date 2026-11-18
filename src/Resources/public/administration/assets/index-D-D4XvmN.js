import{C as l}from"./ld-opus-D9Jxd-vq.js";const i={template:`
<span
    class="lu-chip"
    :style="{ '--lu-t': 'var(--lu-' + color + ')' }"
    :title="title"
>
    <mt-icon
        v-if="icon"
        class="lu-chip__icon"
        :name="icon"
        size="12px"
    />
    <span class="lu-chip__label">{{ label }}</span>
</span>`,props:{label:{type:String,required:!0},color:{type:String,required:!1,default:"c1",validator:e=>l.includes(e)},icon:{type:String,required:!1,default:null},title:{type:String,required:!1,default:null}}};export{i as default};
