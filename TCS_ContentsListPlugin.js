// ---- MAIN PLUGIN FUNCTION ---- //

// Finding all headings //

function findHeadings() {
    return document.querySelector('.blog-item-content').querySelectorAll('.html-block h2, .html-block h3, .html-block h4');
};

// Assigning identity (classes and ID's) to each heading //

function assignIdentity(headings) {
    headings.forEach((heading, index) => {
        heading.id = `heading-${index}`;
        heading.className = `heading-${index}`;
    });
};

// Checking if the 'contents' block exists in a code block or not //

function checkForCodeBlock() {
    let contentsBlock = document.getElementById('contents');
    if (!contentsBlock) {
        contentsBlock = document.createElement('div');
        contentsBlock.id = 'contents';
        document.querySelector('.blog-item-content').insertBefore(contentsBlock, document.querySelector('.blog-item-content').firstChild);
    }
    return contentsBlock;
}

// Helper function to create an item for the contents list //

function createListItem(tag, index, heading) {
    let item = document.createElement('li');
    let outerWrapper = document.createElement('div');
    let innerWrapper = document.createElement('div');
    innerWrapper.classList.add('contents-inner-wrapper');
    outerWrapper.classList.add('contents-outer-wrapper');
    item.classList.add(`heading-${index}`);
    item.innerHTML = `<a href="#${heading.id}">${heading.innerHTML}</a>`;
    outerWrapper.appendChild(innerWrapper);
    item.appendChild(outerWrapper);
    return item;
}

// Main Function to generate the actual contents list by trawling through the list of headings //

function createList(headings) {

    // Helper function to find the most recent, previous heading of a certain tag type //

    function findLastHeading(array, index, tag) {
        return Array.from(array).slice(0, index).reverse().find(heading => heading.tagName === tag);
    }

    // Creating the main list element, along with its wrapper //

    let contentsListWrapper = document.createElement('div');
    contentsListWrapper.id = 'contents-list-wrapper';
    let mainList = document.createElement('ul');
    mainList.id = 'contents-list';
    contentsListWrapper.appendChild(mainList);

    // Iterating over the list of headings, and applying logic to add them to the correct place in the list //

    headings.forEach((heading, index) => {

        // Checking if it's a 'H2' tag, and if so, adding it straight to the main list //

        if (heading.tagName === 'H2') {
            mainList.appendChild(createListItem('H2', index, heading));
        }

        // Checking if it's a 'H3' tag, and if so, appending it to the closest parent H2, or the main list if there is no previous H2 //
        
        else if (heading.tagName === 'H3') {
            let closestParent = findLastHeading(headings, index, 'H2');
            if (closestParent === undefined) {
                mainList.appendChild(createListItem('H3', index, heading));
            } else {
                let allListChildren = mainList.getElementsByTagName("*");
                Array.from(allListChildren).forEach(listItem => {
                    if (listItem.classList.contains(closestParent.classList[0])) {
                        let h3List = document.createElement('ul');
                        listItem.querySelector('.contents-inner-wrapper').appendChild(h3List);
                        h3List.appendChild(createListItem('H3', index, heading));
                    }
                });
            }
        }
        
        // Checking if it's a 'H4' and if so, appending it to the closest parent H3. If there is no H3 present before a H2, then it will be appended to the H2 instead. If no H3 or H2 is found, it will instead be added to the main list //
        
        else if (heading.tagName === 'H4') {
            let closestParentH3 = findLastHeading(headings, index, 'H3');
            let closestParentH2 = findLastHeading(headings, index, 'H2');
            let closestParent = closestParentH3 && closestParentH3.compareDocumentPosition(closestParentH2) & Node.DOCUMENT_POSITION_PRECEDING ? closestParentH3 : closestParentH2;
            if (closestParent === undefined) {
                mainList.appendChild(createListItem('H4', index, heading));
            } else {
                let allListChildren = mainList.getElementsByTagName("*");
                Array.from(allListChildren).forEach(listItem => {
                    if (listItem.classList.contains(closestParent.classList[0])) {
                        let h4List = document.createElement('ul');
                        listItem.querySelector('.contents-inner-wrapper').appendChild(h4List);
                        h4List.appendChild(createListItem('H4', index, heading));
                    }
                });
            }
        }
        
    });

    // Returning the final list wrapper containing the completed contents list //

    return contentsListWrapper;

};

// Function to run all the previous functions in the correct order to generate the contents list on the page //

function insertContentsList() {
    // Finding/generating the 'contents' block and assigning it to a variable //
    let contentsBlock = checkForCodeBlock();
    // Finding all the headings and assigning them to a variable //
    let allHeadings = findHeadings();
    // Assigning identity to all the headings //
    assignIdentity(allHeadings)
    // Generating the contents list from the list of headings and appending it to the 'contents' block //
    contentsBlock.appendChild(createList(allHeadings));
}

// Checking if the user has decided to not use a contents block on the page, if not, it adds one //

if (!document.getElementById('no-contents')) {
    insertContentsList();
}

// ---- ADDING USER CUSTOMISATION ---- //

// Adding the individual heading dropdowns, along with the functionality to disable them //

// Function that adds the dropdown icons to each element that requires them (adds nothing if the item has no children) //
  
function addDropdownIcons() {
    let elementList = document.getElementById('contents-list').querySelectorAll('*');
    elementList.forEach(element => {
        if (element.classList.contains('contents-inner-wrapper')) {
            if (element.children.length > 0) {
                let iconWrapper = document.createElement('div');
                iconWrapper.classList.add('dropdown-icon');
                iconWrapper.classList.add('dropdown-icon-closed');
                var iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 140 240" fill="none">
                <path d="M15 15L125 120L15 225" stroke="currentColor" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
                iconWrapper.innerHTML = iconSVG; 
                element.parentElement.parentElement.appendChild(iconWrapper);
            } else {
                return;
            }
        }
    });
    elementList.forEach(element => {
        if (element.classList.contains('contents-outer-wrapper')) {
            element.classList.add('contents-dropdown-closed');
        }
    });
}

// Helper function to open/close the dropdowns, both for the main, and individual heading dropdowns //
  
function openDropdown(element, target) {
    if (element.classList.contains('contents-dropdown-open')) {
        element.classList.remove('contents-dropdown-open');
        element.classList.add('contents-dropdown-closed');
    } else {
        element.classList.add('contents-dropdown-open');
        element.classList.remove('contents-dropdown-closed');
    }
    if (target.classList.contains('dropdown-icon-open')) {
        target.classList.remove('dropdown-icon-open');
        target.classList.add('dropdown-icon-closed');
    } else {    
        target.classList.add('dropdown-icon-open');
        target.classList.remove('dropdown-icon-closed');
    }
}

// Function that adds the event listeners to the dropdown icons //

function addDropdownListeners() {
    let dropdownIcons = document.querySelectorAll('.dropdown-icon');
    dropdownIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            openDropdown(icon.previousElementSibling, icon);
        });
    });
}

// Adds dropdown icons if the user has enabled them, or if they haven't enabled customisation at all //

if (document.getElementById('contents').getAttribute("data-individual-dropdowns-enabled") === 'true' || document.getElementById('contents').getAttribute("data-main-dropdown-enabled") === null) {
    addDropdownIcons();
    addDropdownListeners();
}

// Adding the title, along with the functionality to change it, and disable it //

// Function that adds the title to the contents block, along with changing it to whatever the user sets //

function addTitle() {
    let contentsBlock = document.getElementById('contents');
    let titleWrapper = document.createElement('div');
    titleWrapper.id = 'contents-title-wrapper';
    let title = document.createElement('h2');
    title.id = 'contents-title';
    title.innerHTML = `${contentsBlock.getAttribute("data-title-text")}`;
    titleWrapper.appendChild(title);
    if (contentsBlock.getAttribute("data-title-text") === null) {
        title.innerHTML = 'Table of Contents';
    }
    contentsBlock.insertBefore(titleWrapper, contentsBlock.firstChild);
}

// Adds the title to the contents block if the user has enabled it //

if (document.getElementById('contents').getAttribute("data-title-enabled") === 'true' || document.getElementById('contents').getAttribute("data-title-enabled") === null) {
    addTitle();
}

// Adding the main dropdown, along with the functionality to disable them //

// Function that adds the main dropdown button //

function addMainDropdown() {
    let contentsBlock = document.getElementById('contents');
    let mainDropdown = document.createElement('div');
    let contentsListWrapper = document.getElementById('contents-list-wrapper');
    mainDropdown.classList.add('main-dropdown-button');
    if (document.getElementById('contents').getAttribute("data-open-by-default") === 'true' || document.getElementById('contents').getAttribute("data-open-by-default") === null) {
        mainDropdown.classList.add('dropdown-icon-open');
    } else {
        mainDropdown.classList.add('dropdown-icon-closed');
    }
    var iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 140 240" fill="none">
                <path d="M15 15L125 120L15 225" stroke="currentColor" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
    mainDropdown.innerHTML = iconSVG;
    if (document.getElementById('contents').getAttribute("data-open-by-default") === 'true' || document.getElementById('contents').getAttribute("data-open-by-default") === null) {
        contentsListWrapper.classList.add('contents-dropdown-open');
    } else {
        contentsListWrapper.classList.add('contents-dropdown-closed');
    }
    contentsListWrapper.classList.add('main-dropdown-enabled');
    let titleWrapper = document.getElementById('contents-title-wrapper');
    if (titleWrapper === null) {
    contentsBlock.appendChild(mainDropdown);
    } else {
        titleWrapper.appendChild(mainDropdown);
    }
}

// Function that adds the event listener to the title, or the main dropdown button if there is no title, also adjusts the height of the dropdown button to match the title //

function addMainDropdownListener() {
    let mainDropdown = document.querySelector('.main-dropdown-button');
    let dropdownTitle = document.getElementById('contents-title-wrapper');
    if (dropdownTitle === null) {
        mainDropdown.addEventListener('click', () => {
            openDropdown(document.getElementById('contents-list-wrapper'), mainDropdown);
        });
    } else {
        dropdownTitle.addEventListener('click', () => {
            openDropdown(document.getElementById('contents-list-wrapper'), mainDropdown);
            dropdownTitle.style.cursor = "pointer";
            mainDropdown.classList.add('title-enabled');
        });
    }
};

// Adds dropdown icons if the user has enabled them, or if they haven't enabled customisation at all //

if (document.getElementById('contents').getAttribute("data-main-dropdown-enabled") === 'true' || document.getElementById('contents').getAttribute("data-main-dropdown-enabled") === null) {
    addMainDropdown();
    addMainDropdownListener();
}