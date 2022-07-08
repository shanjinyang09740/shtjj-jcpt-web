<template>
  <div
    class="control-bar"
    :style="{
      width,
      height,
      'line-height': height,
    }"
  >
    <div class="left-area">
      <template v-for="config in _leftConfig">
        <fu-button
          :key="config.label + config.icon"
          :type="config.type || ''"
          :icon="config.icon || ''"
          :size="config.size || 'medium'"
          :plain="config.plain || false"
          :round="config.round || false"
          :circle="config.circle || false"
          :disabled="config.disabled || false"
          @click="config.handler"
          >{{ config.label }}</fu-button
        >
      </template>
      <slot name="left"></slot>
    </div>
    <div class="center-area">
      <template v-for="config in _centerConfig">
        <fu-button
          :key="config.label + config.icon"
          :type="config.type || ''"
          :icon="config.icon || ''"
          :size="config.size || 'medium'"
          :plain="config.plain || false"
          :round="config.round || false"
          :circle="config.circle || false"
          :disabled="config.disabled || false"
          @click="config.handler"
          >{{ config.label }}</fu-button
        >
      </template>
      <slot name="center"></slot>
    </div>
    <div class="right-area">
      <template v-for="config in _rightConfig">
        <fu-button
          :key="config.label + config.icon"
          :type="config.type || ''"
          :icon="config.icon || ''"
          :size="config.size || 'medium'"
          :plain="config.plain || false"
          :round="config.round || false"
          :circle="config.circle || false"
          :disabled="config.disabled || false"
          @click="config.handler"
          >{{ config.label }}</fu-button
        >
      </template>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
import { Button as FuButton } from "fusion-ui"
export default {
  name: "ControlBar",
  components: {
    FuButton,
  },
  props: {
    // 控制条高度
    height: {
      type: String,
      default: "60px",
    },
    // 控制条宽度
    width: {
      type: String,
      default: "100%",
    },
    // 左侧快捷配置
    leftConfig: {
      type: Array,
      default: () => [],
    },
    // 左侧快捷配置
    centerConfig: {
      type: Array,
      default: () => [],
    },
    // 左侧快捷配置
    rightConfig: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    _leftConfig() {
      return this.leftConfig.filter(
        (config) => "label" in config || "icon" in config
      )
    },
    _centerConfig() {
      return this.centerConfig.filter(
        (config) => "label" in config || "icon" in config
      )
    },
    _rightConfig() {
      return this.rightConfig.filter(
        (config) => "label" in config || "icon" in config
      )
    },
  },
}
</script>

<style lang="less" scoped>
.control-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left-area {
    flex: auto;
    text-align: left;
  }

  .center-area {
    flex: auto;
    text-align: center;
  }

  .right-area {
    flex: auto;
    text-align: right;
  }
}
</style>
