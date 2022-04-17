const data = [];
const tempFilters = [];
let availableFilters = [];

// Selectors
const filtersBtn = document.querySelector(".js-filters-mobile-btn");
const filterClearBtn = document.querySelector('.js-filter-clear-btn');

// Event Listeners
filtersBtn.addEventListener("click", () => filtersBtnEvent());
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

const filtersBtnEvent = () => {
    const filtersContainer = document.querySelector('.filters-mobile-container');

    const target = event.target;

    target.closest('.js-filters-mobile-btn').classList.add("active"); 

    if(filtersBtn.classList.contains("active")){
        if(!filtersContainer){
            const div = document.createElement('div');
            div.classList.add("filters-mobile-container");
    
            div.innerHTML = `
                <div class="filter-mobile-btns">
                    ${availableFilters.map(filter => `<div class="skill-pill">${filter}</div>`).join('')}
                </div>
                
                <div class="btn js-apply-filters">Apply Filters</div>
                `;
    
            filtersBtn.appendChild(div);
        } else {
            filtersContainer.style.display = "block";
        }
    } else {
        filtersContainer.style.display = "none";
    }   

    if(target.classList.contains('skill-pill')){
        if(!target.classList.contains('active')){
            target.classList.add('active');
        } else {
            target.classList.remove('active');
        }
    }

    if(target.classList.contains('close-btn')){
        filtersContainer.style.display = "none";
        target.closest('.js-filters-mobile-btn').classList.remove("active");
    }

    if(target.classList.contains('js-apply-filters')){
        const activeFilters = [];
        const activeSkillPills = document.querySelectorAll('.skill-pill.active');
        const filteredData = [];
        
        activeSkillPills.forEach(pill => {
            activeFilters.push(pill.innerText);
        });

        if(activeFilters.length > 0){
            function filterData() { 
                data.forEach(element => {
                    if(activeFilters.every(language => element.languages.includes(language))){
                        filteredData.push(element);
                    }
            })};
    
            filterData();
    
            displayJobs(filteredData);
        } else {
            displayJobs(data);
        }

        filtersContainer.style.display = "none";
        target.closest('.js-filters-mobile-btn').classList.remove("active");
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

    
    !activeFilters.includes(skill) && selectedFiltersContainer.appendChild(div);

    !activeFilters.includes(skill) && activeFilters.push(skill);

    if(activeFilters.length > 0){
        filterBarContainer.classList.add('active');
    }
};

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

    skillPill.remove();
};

function clearAllSkills(){
    const filterPills = document.querySelectorAll('.selected-filters .skill-pill');

    filterPills.forEach(pill => {
        pill.remove();
    });

    filterBarContainer.classList.remove('active');
}