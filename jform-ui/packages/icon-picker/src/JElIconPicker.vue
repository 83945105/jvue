<template>
  <div>
    <el-input v-model="value_" v-bind="bind__"
              @blur="onBlur"
              @focus="onFocus"
              @change="onChange"
              @input="onInput"
              @clear="onClear"
    >
      <template #prefix>
        <slot name="prefix"></slot>
      </template>
      <template #suffix>
        <slot name="suffix"></slot>
      </template>
      <template #prepend>
        <slot name="prepend">
          <el-button :icon="value_"/>
        </slot>
      </template>
      <template #append>
        <slot name="append">
          <el-button v-if="!readonly" icon="el-icon-info" @click="dialogVisible_ = true"/>
        </slot>
      </template>
    </el-input>
    <j-el-dialog :visible.sync="dialogVisible_" title="选择图标" top="10vh" append-to-body :close-on-click-modal="false">
      <template #default="{height}">
        <icon-library :height="height - 144" :options="$JVue['icon-picker']" @click="onClick"/>
      </template>
    </j-el-dialog>
  </div>
</template>

<script>
  import IconLibrary from "../../../src/components/icon/IconLibrary";

  export default {
    name: "j-el-icon-picker",
    components: {IconLibrary},
    props: {
      value: String,
      maxlength: Number,
      minlength: Number,
      placeholder: String,
      clearable: Boolean,
      disabled: Boolean,
      size: String,
      prefixIcon: String,
      suffixIcon: String,
      autocomplete: {
        type: String,
        default: 'off'
      },
      name: String,
      readonly: Boolean,
      max: Number,
      min: Number,
      step: Number,
      autofocus: Boolean,
      form: String,
      label: String,
      tabindex: String,
      validateEvent: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        value_: '',
        dialogVisible_: false
      };
    },

    computed: {
      bind__() {
        return {
          maxlength: this.maxlength,
          minlength: this.minlength,
          placeholder: this.placeholder,
          clearable: this.clearable,
          disabled: this.disabled,
          size: this.size,
          prefixIcon: this.prefixIcon,
          suffixIcon: this.suffixIcon,
          autocomplete: this.autocomplete,
          name: this.name,
          readonly: this.readonly,
          max: this.max,
          min: this.min,
          step: this.step,
          autofocus: this.autofocus,
          form: this.form,
          label: this.label,
          tabindex: this.tabindex,
          validateEvent: this.validateEvent
        };
      }
    },

    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (!val) return;
          this.value_ = val;
        }
      },
      value_: {
        handler(val) {
          this.$emit('input', val);
        }
      }
    },

    methods: {
      onBlur(e) {
        this.$emit('blur', e);
      },
      onFocus(e) {
        this.$emit('focus', e);
      },
      onChange(value) {
        this.$emit('change', value);
      },
      onInput(value) {
        this.$emit('input', value);
      },
      onClear() {
        this.$emit('clear');
      },
      onClick(val) {
        this.value_ = val;
        this.dialogVisible_ = false;
      }
    }
  }
</script>

<style scoped>

</style>
