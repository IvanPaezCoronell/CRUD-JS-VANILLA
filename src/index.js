const $taskList = document.querySelector('.task-list');
const $taskListSection = document.querySelector('.task-list-section');
const $fragment = document.createDocumentFragment();
const $template = document.querySelector('.template').content;
const $form = document.querySelector('.form');
const $formTitle = document.querySelector('.form-title');


// Obtiene todas las Task de la db local y las agrega al dashboard.
async function getTask() {
	try {
		let response = await axios.get('http://localhost:3000/tasks');
		let data = await response.data;

		data.map(el => {
			// agrega el contenido al template
			$template.querySelector('.template-task-title').textContent = el.task;
			$template.querySelector('.template-task-status').textContent = el.status;
			$template.querySelector('.template-task-priority').textContent =
				el.priority;
			$template.querySelector('.template-task-description').textContent =
				el.description;

			console.log(el);

			// Agrega los data-atrributte a los botones de edit/eliminar (para usarlo mas tarde en la peticion PUT)
			$template.querySelector('.edit').dataset.id = el.id;
			$template.querySelector('.edit').dataset.task = el.task;
			$template.querySelector('.edit').dataset.status = el.status;
			$template.querySelector('.edit').dataset.priority = el.priority;
			$template.querySelector('.edit').dataset.description = el.description;
			$template.querySelector('.delete').dataset.id = el.id;
			$template.querySelector('.delete').dataset.task = el.task;

			// Se clona/Importa el nodo del template para luego agregarlo a un fragment
			let $cloneTemplate = document.importNode($template, true);
			$fragment.appendChild($cloneTemplate);

			console.log(el);
		});

		// Se agrega el fragment al html
		$taskList.querySelector('section').appendChild($fragment);
		console.log(response, data);
	} catch (err) {
		let messageError =
			err.response.statusText || 'Ocurrio un problema en la peticion';
		$taskListSection.insertAdjacentHTML(
			'beforebegin',
			`<p>ERROR ${err.response.status}: ${messageError}</p>`,
		);
	}
}

document.addEventListener('DOMContentLoaded', getTask);

// evento para el submit
document.addEventListener('submit', async e => {
	// Valida si el evento lo origina el input de tipo submit del formulario
	if (e.target === $form) {
		e.preventDefault();

		// Valida si el input ocluto con id esta vacio o contiene un valor.
		if (!e.target.id.value) {
			// Si esta vacio -  Agregar
			try {
				let response = await axios.post('http://localhost:3000/tasks', {
					task: e.target.taskname.value,
					description: e.target.description.value,
					priority: e.target.priority.value,
					status: e.target.status.value,
				});
			} catch (err) {
				alert('Error al hacer la peticion');
			}

			location.reload();
		} else {
			// Si contiene un ID - Actualiza
			try {
				let response = await axios.put(
					`http://localhost:3000/tasks/${e.target.id.value}`,
					{
						task: e.target.taskname.value,
						description: e.target.description.value,
						priority: e.target.priority.value,
						status: e.target.status.value,
					},
				);
			} catch (err) {
				alert('Error al hacer la peticion');
			}
		}
	}
});

// evento para los botones editar/eliminar
document.addEventListener('click', async e => {
	// Valida que ele vente lo origina el boton con clase .edit
	if (e.target.matches('.edit')) {
		$formTitle.textContent = 'Formulario - Actualizar Tarea';
		$form.taskname.value = e.target.dataset.task;
		$form.status.value = e.target.dataset.status;
		$form.priority.value = e.target.dataset.priority;
		$form.description.value = e.target.dataset.description;
		$form.id.value = e.target.dataset.id;
	}

	// Valida que ele vente lo origina el boton con clase .delete
	if (e.target.matches('.delete')) {
		let isDelete = confirm(`Eliminar tarea "${e.target.dataset.task}" ?`, {
			buttons: ['No', 'Si'],
		});

		// si el valor de isDelete es true, elimina la tarea
		if (isDelete) {
			try {
				let response = await axios.delete(
					`http://localhost:3000/tasks/${e.target.dataset.id}`,
				);
				alert('La tarea de ha eliminado correctamente!');
			} catch (err) {
				alert('No fue posible eliminar la tarea!');
			}
		}
	}
});


document.addEventListener('DOMContentLoaded', e => {
  const $templateTitle = document.querySelector('.template-task-title')

  console.log('fr',e)
  console.log('fdewfs',$form.status.value)

  if($form.status.value === 'pendiente') {
    $templateTitle.classList.add('template-task-title-pending')
  }
})

