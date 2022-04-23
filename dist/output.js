"use strict";

var data = [];
var tempFilters = [];
var availableFilters = []; // Selectors

var filterClearBtn = document.querySelector('.js-filter-clear-btn'); // Event Listeners

filterClearBtn.addEventListener("click", function () {
  return clearAllSkills();
});

var getData = function getData() {
  fetch("data.json").then(function (response) {
    return response.json();
  }).then(function (json) {
    json.map(function (element) {
      data.push(element);
      data.map(function (element) {
        element.languages.forEach(function (language) {
          tempFilters.push(language);
        });
      });
    });
    removeDuplicateFilters(availableFilters);
    availableFilters = removeDuplicateFilters(tempFilters);
    console.log(data);
    displayJobs(data);
    initializeSkillBtns();
  });
};

getData();

var removeDuplicateFilters = function removeDuplicateFilters(arr) {
  return arr.filter(function (item, index) {
    return arr.indexOf(item) === index;
  });
};

var displayJobs = function displayJobs(data) {
  console.log("displayJobs");
  var jobsContainer = document.querySelector(".jobs-container");
  jobsContainer.innerHTML = "";

  if (data.length > 0) {
    data.forEach(function (element) {
      var div = document.createElement("div");
      div.classList.add("job-card");
      div.innerHTML = "\n            <div class=\"job-card-top\">\n            <img src=\"".concat(element.logo, "\" alt=\"Photosnap\" class=\"brand-logo\">\n            <div class=\"tags\">\n              <div class=\"company-name\">").concat(element.company, "</div>\n              ").concat(element["new"] ? "<div class=\"pill green-bg\">New!</div>" : '', "\n              ").concat(element.featured ? "<div class=\"pill green-bg\">Featured</div>" : '', "\n            </div>\n            <div class=\"job-title\">").concat(element.position, "</div>\n            <div class=\"job-details\">\n              <div class=\"job-detail\">").concat(element.postedAt, "</div>\n              <div class=\"job-detail\">").concat(element.contract, "</div>\n              <div class=\"job-detail\">").concat(element.location, "</div>\n            </div>\n            <div class=\"spacer-line\"></div>\n            </div>\n            <div class=\"job-card-bottom\">\n                <div class=\"required-skills\">\n                ").concat(element.languages.map(function (language) {
        return "<div class=\"skill-pill\">".concat(language, "</div>");
      }).join(''), "\n                </div>\n            </div>\n            ");
      jobsContainer.appendChild(div);
      initializeSkillBtns();
    });
  } else {
    var div = document.createElement("div");
    div.innerHTML = "\n        <div class=\"heading\">\n            <span>No results found, please adjust filters!</span>\n        </div>\n        ";
    jobsContainer.appendChild(div);
  }
};

var activeFilters = [];

var initializeSkillBtns = function initializeSkillBtns() {
  var skillPillBtns = document.querySelectorAll('.required-skills .skill-pill');
  skillPillBtns.forEach(function (skill) {
    skill.addEventListener('click', function () {
      return addFilters(skill.innerText);
    });
  });
}; // Selectors for the filter bar


var filterBarContainer = document.querySelector('.filter-bar');
var selectedFiltersContainer = document.querySelector('.selected-filters');

var addFilters = function addFilters(skill) {
  var div = document.createElement('div');
  div.classList.add('skill-pill');
  div.innerHTML = "\n            <div class=\"skill\">".concat(skill, "</div> \n            <img class=\"skill-pill-remove-btn\" onClick=\"removeSkill()\" src=\"/images/icon-remove.svg\" alt=\"cross\" title=\"remove skill\" />\n        ");

  if (!activeFilters.includes(skill)) {
    activeFilters.push(skill);
    selectedFiltersContainer.appendChild(div);
  }

  if (activeFilters.length > 0) {
    filterBarContainer.classList.add('active');
  }

  var filteredData = [];
  filterData(filteredData);
  displayJobs(filteredData);
};

function filterData(filteredData) {
  data.forEach(function (element) {
    if (activeFilters.every(function (language) {
      return element.languages.includes(language);
    })) {
      filteredData.push(element);
    }
  });
}

;

function removeSkill() {
  var target = event.target;
  var skillPill = target.closest('.skill-pill');
  var skill = target.previousElementSibling.innerText;
  activeFilters.map(function (filter, index) {
    if (filter === skill) {
      activeFilters.splice(index, 1);
    }
  });

  if (activeFilters.length === 0) {
    filterBarContainer.classList.remove('active');
  }

  console.log(activeFilters);
  skillPill.remove();
  var filteredData = [];
  filterData(filteredData);
  displayJobs(filteredData);
}

;

function clearAllSkills() {
  var filterPillsRemoveBtns = document.querySelectorAll('.selected-filters .skill-pill-remove-btn');
  filterPillsRemoveBtns.forEach(function (btn) {
    btn.click();
  });
  filterBarContainer.classList.remove('active');
}

;
