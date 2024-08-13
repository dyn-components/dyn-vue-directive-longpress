import { DirectiveBinding, VNode } from 'vue';

const DynDirective = {
	// 在绑定元素的 attribute 或事件监听器被应用之前调用
	// created(el: HTMLElement, binding: DirectiveBinding, vnode: VNode, prevVnode: VNode | null) {
	// },

	// 在绑定元素插入到 DOM 前调用
	beforeMount(el: HTMLElement, binding: DirectiveBinding, _vnode: VNode, _prevVnode: VNode | null) {
		// 长按持续时间（默认 500 毫秒）
		const duration: any = binding.arg || 500;
		let pressTimer: NodeJS.Timeout | null = null;
		let isLongPress = false;

		// 触发长按的函数
		const handler = () => {
			binding.value();
		};

		// 开始长按的函数
		const onStartPress = (e: MouseEvent | TouchEvent) => {
			isLongPress = false;
			// 如果是鼠标事件，并且按下的不是左键，则返回
			if (e instanceof MouseEvent && e.button !== 0) {
				return;
			}
			pressTimer = setTimeout(() => {
				isLongPress = true;
				handler();
			}, duration);
		};

		// 取消长按的函数
		const onStopPress = (e: MouseEvent | TouchEvent) => {
			if (pressTimer) {
				clearTimeout(pressTimer);
				pressTimer = null;
			}
			// 如果发生了长按，则阻止单击事件
			if (isLongPress) {
				e.preventDefault();
				e.stopImmediatePropagation();
			}
		};

		const onClick = (e: MouseEvent | TouchEvent) => {
			if (isLongPress) {
				e.preventDefault();
				e.stopImmediatePropagation();
			}
			console.log("inner click");
		};

		// 添加事件监听器
		el.addEventListener('mousedown', onStartPress);
		el.addEventListener('touchstart', onStartPress);

		el.addEventListener('mouseup', onStopPress);
		el.addEventListener('mouseleave', onStopPress);
		el.addEventListener('touchend', onStopPress);
		el.addEventListener('touchcancel', onStopPress);

		el.addEventListener('click', onClick, { capture: true });
	
		// Store event handlers on the element for cleanup
		(el as any).__longpressHandlers = { onStartPress, onStopPress, onClick };
	},

	// 在绑定元素插入到 DOM 时调用
	// mounted(el: HTMLElement, binding: DirectiveBinding, vnode: VNode, prevVnode: VNode | null) {
	// },

	// 在包含组件的 VNode 更新之前调用
	// beforeUpdate(el: HTMLElement, binding: DirectiveBinding, vnode: VNode, prevVnode: VNode | null) {
	// },

	// 在包含组件的 VNode 及其子 VNode 更新之后调用
	// updated(el: HTMLElement, binding: DirectiveBinding, vnode: VNode, prevVnode: VNode | null) {
	// },

	// 在绑定元素的父组件卸载之前调用
	// beforeUnmount(el: HTMLElement, binding: DirectiveBinding, vnode: VNode, prevVnode: VNode | null) {
	// },

	// 在绑定元素的父组件卸载之后调用
	unmounted(el: HTMLElement, _binding: DirectiveBinding, _vnode: VNode, _prevVnode: VNode | null) {
		// 移除事件监听器
		const handlers = (el as any).__longpressHandlers;
		el.removeEventListener('mousedown', handlers.onStartPress);
		el.removeEventListener('touchstart', handlers.onStartPress);

		el.removeEventListener('mouseup', handlers.onStopPress);
		el.removeEventListener('mouseleave', handlers.onStopPress);
		el.removeEventListener('touchend', handlers.onStopPress);
		el.removeEventListener('touchcancel', handlers.onStopPress);

		el.removeEventListener('click', handlers.onClick, { capture: true });

		// Clean up stored handlers
		delete (el as any).__longpressHandlers;
	},
}

export default DynDirective