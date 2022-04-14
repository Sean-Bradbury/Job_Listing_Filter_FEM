"use strict";

var data = [];
var tempFilters = [];
var availableFilters = []; // Selectors

var filtersBtn = document.querySelector(".js-filters-mobile-btn"); // Event Listeners

filtersBtn.addEventListener("click", function () {
  return filtersBtnEvent();
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
    });
  } else {
    var div = document.createElement("div");
    div.innerHTML = "\n        <div class=\"heading\">\n            <span>No results found, please adjust filters!</span>\n        </div>\n        ";
    jobsContainer.appendChild(div);
  }
};

var filtersBtnEvent = function filtersBtnEvent() {
  var filtersContainer = document.querySelector('.filters-mobile-container');
  var target = event.target;
  target.closest('.js-filters-mobile-btn').classList.add("active");

  if (filtersBtn.classList.contains("active")) {
    if (!filtersContainer) {
      var div = document.createElement('div');
      div.classList.add("filters-mobile-container");
      div.innerHTML = "\n                <div class=\"filter-mobile-btns\">\n                    ".concat(availableFilters.map(function (filter) {
        return "<div class=\"skill-pill\">".concat(filter, "</div>");
      }).join(''), "\n                </div>\n                \n                <div class=\"btn js-apply-filters\">Apply Filters</div>\n                ");
      filtersBtn.appendChild(div);
    } else {
      filtersContainer.style.display = "block";
    }
  } else {
    filtersContainer.style.display = "none";
  }

  if (target.classList.contains('skill-pill')) {
    if (!target.classList.contains('active')) {
      target.classList.add('active');
    } else {
      target.classList.remove('active');
    }
  }

  if (target.classList.contains('close-btn')) {
    filtersContainer.style.display = "none";
    target.closest('.js-filters-mobile-btn').classList.remove("active");
  }

  if (target.classList.contains('js-apply-filters')) {
    var _activeFilters = [];
    var activeSkillPills = document.querySelectorAll('.skill-pill.active');
    var filteredData = [];
    activeSkillPills.forEach(function (pill) {
      _activeFilters.push(pill.innerText);
    });

    if (_activeFilters.length > 0) {
      var filterData = function filterData() {
        data.forEach(function (element) {
          if (_activeFilters.every(function (language) {
            return element.languages.includes(language);
          })) {
            filteredData.push(element);
          }
        });
      };

      ;
      filterData();
      displayJobs(filteredData);
    } else {
      displayJobs(data);
    }

    filtersContainer.style.display = "none";
    target.closest('.js-filters-mobile-btn').classList.remove("active");
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
};

var addFilters = function addFilters(skill) {
  var selectedFiltersContainer = document.querySelector('.selected-filters');
  var div = document.createElement('div');
  div.classList.add('skill-pill');
  div.innerHTML = "\n            <div class=\"skill\">".concat(skill, "</div> \n            <img class=\"skill-pill-remove-btn\" onClick=\"removeSkill()\" src=\"/images/icon-remove.svg\" alt=\"cross\" title=\"remove skill\" />\n        ");
  !activeFilters.includes(skill) && selectedFiltersContainer.appendChild(div);
  !activeFilters.includes(skill) && activeFilters.push(skill);
};

function removeSkill() {
  var target = event.target;
  var skillPill = target.closest('.skill-pill');
  var skill = target.previousElementSibling.innerText;
  activeFilters.map(function (filter, index) {
    if (filter === skill) {
      activeFilters.splice(index, 1);
    }
  });
  skillPill.remove();
}

;
