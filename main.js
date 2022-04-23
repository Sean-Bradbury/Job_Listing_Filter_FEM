const data = [];
const tempFilters = [];
let availableFilters = [];

// Selectors
const filterClearBtn = document.querySelector('.js-filter-clear-btn');

// Event Listeners
filterClearBtn.addEventListener("click", () => clearAllSkills());

const getData =  () => {
    fetch("data.json")
        .then(response => response.json())
        .then(json => {
            json.map(element => {
                data.push(element);
                data.map(element => {element.languages.forEach(language => {tempFilters.push(language)})});
            });

            removeDuplicateFilters(availableFilters);
            availableFilters = removeDuplicateFilters(tempFilters);
            console.log(data);
            displayJobs(data);
            initializeSkillBtns();
    });
};

getData();

const removeDuplicateFilters = (arr) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
};

const displayJobs = (data) => {
    console.log("displayJobs");
    const jobsContainer = document.querySelector(".jobs-container");

    jobsContainer.innerHTML = "";

    if(data.length > 0){
        data.forEach(element => {
            const div = document.createElement("div");
    
            div.classList.add("job-card");
    
            div.innerHTML = `
            <div class="job-card-top">
            <img src="${element.logo}" alt="Photosnap" class="brand-logo">
            <div class="tags">
              <div class="company-name">${element.company}</div>
              ${element.new ? `<div class="pill green-bg">New!</div>` : ''}
              ${element.featured ? `<div class="pill green-bg">Featured</div>` : ''}
            </div>
            <div class="job-title">${element.position}</div>
            <div class="job-details">
              <div class="job-detail">${element.postedAt}</div>
              <div class="job-detail">${element.contract}</div>
              <div class="job-detail">${element.location}</div>
            </div>
            <div class="spacer-line"></div>
            </div>
            <div class="job-card-bottom">
                <div class="required-skills">
                ${element.languages.map((language) => `<div class="skill-pill">${language}</div>`).join('')}
                </div>
            </div>
            `;
    
            jobsContainer.appendChild(div);
            initializeSkillBtns();
        });
    } else {
        const div = document.createElement("div");

        div.innerHTML = `
        <div class="heading">
            <span>No results found, please adjust filters!</span>
        </div>
        `;

        jobsContainer.appendChild(div);
    }

};

const activeFilters = [];

const initializeSkillBtns = () => {
    const skillPillBtns = document.querySelectorAll('.required-skills .skill-pill');
    
    skillPillBtns.forEach(skill => {
        skill.addEventListener('click', () => addFilters(skill.innerText));
    });
};

// Selectors for the filter bar
const filterBarContainer = document.querySelector('.filter-bar');
const selectedFiltersContainer = document.querySelector('.selected-filters');

const addFilters = (skill) => {
    const div = document.createElement('div');

    div.classList.add('skill-pill');

    div.innerHTML = 
        `
            <div class="skill">${skill}</div> 
            <img class="skill-pill-remove-btn" onClick="removeSkill()" src="/images/icon-remove.svg" alt="cross" title="remove skill" />
        `;

    if(!activeFilters.includes(skill)) {
        activeFilters.push(skill);

        selectedFiltersContainer.appendChild(div);
    } 

    if(activeFilters.length > 0){
        filterBarContainer.classList.add('active');
    }
    const filteredData = [];

    filterData(filteredData);
    
    displayJobs(filteredData);
};

function filterData(filteredData) { 
    data.forEach(element => {
        if(activeFilters.every(language => element.languages.includes(language))){
            filteredData.push(element);
        }
})};

function removeSkill(){
    const target = event.target;
    const skillPill = target.closest('.skill-pill');
    const skill = target.previousElementSibling.innerText;

    activeFilters.map((filter, index) => {
        if(filter === skill){
            activeFilters.splice(index, 1);
        }
    });

    if(activeFilters.length === 0){
        filterBarContainer.classList.remove('active');
    }

    console.log(activeFilters);

    skillPill.remove();

    const filteredData = [];

    filterData(filteredData);
    
    displayJobs(filteredData);
};

function clearAllSkills(){
    const filterPillsRemoveBtns = document.querySelectorAll('.selected-filters .skill-pill-remove-btn');

    filterPillsRemoveBtns.forEach(btn => {
        btn.click();
    });

    filterBarContainer.classList.remove('active');
};