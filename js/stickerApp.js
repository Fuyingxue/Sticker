/**
 * Created by Baron on 2018/4/26.
 */

const bindEventAddNew = () => {
	var list = ['.add-sticker', '.add-todo']
	for (var i = 0; i < list.length; i++) {
		var button = e(list[i])
		bindEvent(button, 'click', function(){
			var todo = todoNew()
			saveTodo(todo)
			var id = todo.id
			e('.todo-sticker').dataset.id = id
			showTodoList()
		})
	}
}

const changeZIndex = (s) => {
	var container = e('#id-sticker-container')
	var indexS = s.style.zIndex
	var list = es('.sticker')
	for(var i = 0; i < list.length; i++) {
		var item = list[i]
		var zIndex = parseInt(item.style.zIndex)
		if (zIndex > indexS) {
			item.style.zIndex = zIndex - 1
		}
	}
	var z = container.dataset.num
	s.style.zIndex = z
}

const bindEventDrag = () => {
	var list = e('#id-sticker-container')
	// 事件委托
	bindEvent(list, 'mousedown', function(event){
		var target = event.target
		var s = target.closest('.sticker')
		if( s != null) {
			s.dataset.drag = 'true'
			s.dataset.diffX = event.clientX - s.offsetLeft;
			s.dataset.diffY = event.clientY - s.offsetTop;
			changeZIndex(s)
		}
	})

	var body = e('body')
	bindEvent(body, 'mousemove', function(event) {
		var list = es('.sticker')
		for(var i = 0; i < list.length; i++) {
			var s = list[i]
			var drag = s.dataset.drag
			if (drag == 'true') {
				var diffX = s.dataset.diffX
				var diffY = s.dataset.diffY
				var clientX = event.clientX
				var clientY = event.clientY
				s.style.left = clientX - diffX + 'px'
				s.style.top = clientY - diffY + 'px'
			}
		}
	})
	bindEvent(body, 'mouseup', function() {
		removeDragAll()
		refreshTodosAll()
	})
}

const removeDragAll = () => {
	var list = es('.sticker')
	for(var i = 0; i < list.length; i++) {
		var s = list[i]
		s.dataset.drag = 'false'
	}
}

const refreshTodo = (s, todo) => {
	var message = s.querySelector('.sticker-message').innerHTML
	var st = s.querySelector('.sticker-title')
	var title = st.innerHTML
	var done = st.classList.contains('done') ? true : false
	var deadline = s.querySelector('.finish-time').value
	var x = s.style.left
	var y = s.style.top
	var z = s.style.zIndex
	todo.message = message
	todo.title = title
	todo.done = done
	todo.deadline = deadline
	todo.x = x
	todo.y = y
	todo.z = z
}

const refreshTodosAll = () => {
	var list = es('.sticker')
	var result = []
	for(var i = 0; i < list.length; i++) {
		var s = list[i]
		var id = s.dataset.id
		var todo = getTodo(id)
		refreshTodo(s, todo)
		result.push(todo)
	}
	saveTodos(result)
}

const removeEditableAll = () => {
	var list = es('div')
	for(var i = 0; i < list.length; i++) {
		var item = list[i]
		item.removeAttribute('contenteditable')
	}
}

const notEditable = (target, selectorList) => {
	for(var i = 0; i < selectorList.length; i++) {
		var s = selectorList[i]
		var t = target.closest(s)
		if(t != null) {
			t.setAttribute('contenteditable', 'true')
			return false
		}
	}
	return true
}

const bindEventEditable = () => {
	var selectorList = ['.sticker-message', '.sticker-title', '.finish-time']
	var body = e('body')
	bindEvent(body, 'mousedown', function(event){
		var target = event.target
		if (notEditable(target, selectorList)) {
			removeEditableAll()
		}
	})
}

const shakeSticker = () => {
	list = es('.sticker')
	for(var i = 0; i < list.length; i++) {
		var s = list[i]

		s.classList.add('shake')
		setTimeout(function(s){
			if(s != undefined) {
				s.classList.remove('shake')
			}
		}, 500)
	}
}

const deleteSticker = (s) => {
	var id = s.dataset.id
	deleteTodo(id)
	initApp()
	shakeSticker()
}

const bindEventDelete = () => {
	var container = e('#id-sticker-container')
	bindEvent(container, 'click', function(event){
		var target = event.target
		var button = target.closest('.sticker-shut')
		if( button != null) {
			var s = button.closest('.sticker')
			deleteSticker(s)
		}
	})

	bindEventTrashBin()

	var list = e('#id-list-window')
	bindEvent(list, 'click', function(event){
		var target = event.target
		var button = target.closest('.todo-shut')
		if( button != null) {
			var s = button.closest('.todo-card')
			deleteSticker(s)
		}
	})
}

const bindEventTrashBin = () => {
	var bin = e('.trash-bin')
	bindEvent(bin, 'mouseenter', function(event){
		bin.classList.add('trash-bin-hover')
	})
	bindEvent(bin, 'mouseleave', function(event){
		bin.classList.remove('trash-bin-hover')
	})
	bindEvent(bin, 'mouseup', function(event){
		log('mouseup')
		bin.classList.remove('trash-bin-hover')
		var list = es('.sticker')
		for(var i = 0; i < list.length; i++){
			if(list[i].dataset.drag == 'true') {
				var s = list[i]
				deleteSticker(s)
			}
		}
	})
}

const initApp = () => {
	showTodoList()
	var list = es('.sticker')
	var container = e('#id-sticker-container')
	container.dataset.num = list.length
	if (list.length == 0) {
		localStorage.stickersID = 0
	}
}

const targetContain = (target, list) => {
	for(var i = 0; i < list.length; i++) {
		var c = list[i]
		if (target.classList.contains(c)) {
			return true
		}
	}
	return false
}

const bindEventDone = () => {
	var list = e('#id-sticker-container')
	bindEvent(list, 'dblclick', function(event){
		var list = ['sticker', 'sticker-shut', 'sticker-time', 'deadline-title',
					'finish-time', 'create-time', 'sticker-message']
		var target = event.target
		if (targetContain(target, list) == false) {
			if (target.classList.contains('done')){
				target.classList.remove('done')
			} else {
				target.classList.add('done')
			}
		}
	})
}

const bindEventChangePage = () => {
	var wall = e('#id-wall')
	bindEvent(wall, 'click', function(){
		showTodoList()
		var pages = es('.todo-page')
		for (var i = 0; i < pages.length; i++) {
			pages[i].classList.add('hidden')
		}
		var w = e('#id-todo-wall')
		w.classList.remove('hidden')
	})
	var list = e('#id-list')
	bindEvent(list, 'click', function(){
		showTodoList()
		var pages = es('.todo-page')
		for (var i = 0; i < pages.length; i++) {
			pages[i].classList.add('hidden')
		}
		var l = e('#id-todo-list')
		l.classList.remove('hidden')
	})
}

const __main = () => {
	initApp()
	bindEventAddNew()
	bindEventDrag()
	bindEventEditable()
	bindEventDelete()
	bindEventDone()
	bindEventChangePage()
	bindListAnimation()
}

__main()
