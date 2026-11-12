const s={template:`
<nav
    class="lu-tabs"
    :class="{ 'lu-tabs--vertical': vertical }"
    :aria-label="ariaLabel"
>
    <template v-for="group in groupedItems" :key="group.name">
        <div
            v-if="vertical && group.label"
            class="lu-tabs__group"
        >
            {{ group.label }}
        </div>
        <button
            v-for="item in group.items"
            :key="item.name"
            type="button"
            class="lu-tabs__item"
            :class="{ 'is--active': item.name === active, 'is--warn': item.warn }"
            :aria-current="item.name === active ? 'page' : undefined"
            @click="$emit('select', item.name)"
        >
            <mt-icon
                class="lu-tabs__icon"
                :name="item.icon"
                size="16px"
            />
            <span class="lu-tabs__label">{{ item.label }}</span>
            <span
                v-if="item.count !== undefined && item.count !== null"
                class="lu-tabs__count"
            >
                {{ item.count }}
            </span>
            <mt-icon
                v-if="item.warn"
                v-tooltip="item.warnText || ''"
                class="lu-tabs__warn"
                name="regular-exclamation-triangle"
                size="12px"
            />
        </button>
    </template>
</nav>`,emits:["select"],props:{items:{type:Array,required:!0},active:{type:String,required:!0},vertical:{type:Boolean,required:!1,default:!1},groups:{type:Object,required:!1,default:()=>({})},ariaLabel:{type:String,required:!1,default:null}},computed:{groupedItems(){if(!this.vertical)return[{name:"all",label:null,items:this.items}];const t=[];return this.items.forEach(i=>{const a=i.group??"default";let e=t.find(l=>l.name===a);e||(e={name:a,label:this.groups[a]??null,items:[]},t.push(e)),e.items.push(i)}),t}}};export{s as default};
