const bookmarkName = document.getElementById('bookmarkName');
const bookmarkUrl = document.getElementById('bookmarkURL');
const submitBtn = document.getElementById('submitBtn');
const tableContent = document.getElementById('tableContent');
const alertMessage = document.getElementById('alertMessage');
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

function isValidUrl(url) {
  const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return urlPattern.test(url);
}

function renderAlertMessage(message) {
  alertMessage.classList.remove('d-none', 'alert-success');
  alertMessage.classList.add('d-block', 'alert-danger');
  alertMessage.textContent = message;
  setTimeout(() => {
    alertMessage.classList.remove('d-block');
    alertMessage.classList.add('d-none');
  }, 1000);
}

function renderSuccessMessage(message) {
  alertMessage.classList.remove('d-none', 'alert-danger');
  alertMessage.classList.add('d-block', 'alert-success');
  alertMessage.textContent = message;
  setTimeout(() => {
    alertMessage.classList.remove('d-block');
    alertMessage.classList.add('d-none');
  }, 3000);
}

submitBtn.addEventListener('click', function() {
  const bookmarkNameValue = bookmarkName.value.trim();
  const bookmarkUrlValue = bookmarkUrl.value.trim();

  if (!bookmarkNameValue || !bookmarkUrlValue) {
    renderAlertMessage('Please fill in all fields.');
    return;
  }

  if (!isValidUrl(bookmarkUrlValue)) {
    renderAlertMessage('Please enter a valid URL.');
    return;
  }

  const bookmark = {
    name: bookmarkNameValue,
    url: bookmarkUrlValue
  };
  bookmarks.push(bookmark);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  bookmarkName.value = '';
  bookmarkUrl.value = '';

  renderSuccessMessage('Bookmark added successfully.');
  displayBookmarks();
});

function displayBookmarks() {
  tableContent.innerHTML = '';

  bookmarks.forEach((bookmark, index) => {
    tableContent.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${index + 1}</td>
        <td>${bookmark.name}</td>
        <td>
          <button class="btn btn-visit btn-success" data-index="${index}">
            <i class="fa-solid fa-eye pe-2"></i><a href="${bookmark.url}" target="_blank" class="text-decoration-none text-white">Visit</a>
          </button>
        </td>
        <td>
          <button class="btn btn-delete btn-danger pe-2" data-index="${index}">
            <i class="fa-solid fa-trash-can"></i>
            Delete
          </button>
        </td>
      </tr>
    `);
  });

  // Add event listener to delete buttons
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = this.dataset.index;
      bookmarks.splice(index, 1);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      displayBookmarks();
    });
  });
}

// Initial display of bookmarks
displayBookmarks();