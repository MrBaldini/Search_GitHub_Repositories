const input = document.querySelector('.wrapper__input-search');
const dropdownMenu = document.querySelector('.wrapper__dropdown-menu');
const dropdownRepository = document.querySelector('.dropdown-menu__repository');
const repositoriesList = document.querySelector('.wrapper__repositories-list');
const addedRepository = document.querySelector('.repositories-list__repository');
const repositoryContent = document.querySelector('.repository__content');
const deleteButton = document.querySelector('.repository__img-delete');
const wrapperError = document.querySelector('.wrapper_error');
const exception = document.createElement('h4', 'respond-exception');
let timer;

input.addEventListener('keyup', (e) => {
  if (document.querySelector('h4')) document.querySelector('h4').remove();
  if (input.value === '' || input.value.includes(' ')) {
    wrapperError.insertAdjacentHTML('afterbegin', `<h4>Поле ввода пустое или в нём есть пробельные символы,<br>репозиториев с такими именами не существует,<br>пожалуйста, измените запрос.</h4>`);
    wrapperError.style.textAlign = 'center';
    return;
  };
  clearTimeout(timer);
  timer = setTimeout(() => {
    fetch(`https://api.github.com/search/repositories?q=${input.value}`)
      .then(response => {
        if (!document.querySelector('.dropdown--hidden')) {
          dropdownMenu.classList.add('dropdown--hidden');
          for (let i = 0; i < 5; i++) {
            const repo = document.querySelector(`.rep-${i}`);
            repo ? repo.remove() : repo;
          };
        }
        if (response.status === 403) {
          exception.textContent = `Ошибка запроса, попробуйте позже.`;
          wrapperError.append(exception);
        }
        response
          .json()
          .then(res => {
            res.items.forEach((repository, i = 0) => {
              if (i < 5) {
                const clonedRepository = dropdownRepository.cloneNode();

                dropdownMenu.classList.remove('dropdown--hidden');
                clonedRepository.classList.remove('repository--hidden');
                clonedRepository.classList.add(`rep-${i}`);
                clonedRepository.textContent = repository.name;

                dropdownMenu.append(clonedRepository);

                if (i === 0) clonedRepository.style.borderTop = '2px solid #000000';

                clonedRepository.addEventListener('click', (e) => {
                  input.value = '';
                  dropdownMenu.classList.add('dropdown--hidden');
                  for (let i = 0; i < 5; i++) {
                    const repo = document.querySelector(`.rep-${i}`);
                    repo ? repo.remove() : repo;
                  }

                  repositoryContent.innerHTML = `Name: ${repository.name}<br>
                                                Owner: ${repository.owner.login}<br>
                                                Stars: ${repository.stargazers_count}`
                  const listedRepository = addedRepository.cloneNode(true);
                  listedRepository.classList.remove('repository--hidden');

                  repositoriesList.append(listedRepository);

                  listedRepository.querySelector('.repository__img-delete').addEventListener('click', (e) => {
                    listedRepository.remove();
                  });
                });  
              };
              i += 1;
            });
          })
            .catch(err => err);
      });
  }, 700);
});