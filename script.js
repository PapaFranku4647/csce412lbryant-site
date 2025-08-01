// Cache DOM elements for performance
const allChildren = Array.from(document.querySelector(".table").children);
const selectedElementDisplay = document.getElementById("selectedElement").querySelector("span");
const dash = document.getElementById("dash");
const wikiLink = document.getElementById("selectedElement").querySelector("a");
const arrow = document.getElementsByClassName("arrow bounce");
const textboxName = document.getElementById("textbox name");
const textboxText = document.getElementById("textbox text");
const textboxAtom = document.getElementById("textbox atom");
const textboxHolder = document.getElementById("textbox holder");
const textboxSub = document.getElementById("textbox sub");
const textboxCenter = document.getElementById("textbox center");

const atomCanvas = document.getElementById('atom canvas');
const atomCtx = atomCanvas.getContext('2d');


var centerX = atomCanvas.width / 2;
var centerY = atomCanvas.height / 2;
const nucleusRadius = 20;
const electronRadius = 5;
let angle = [0, 0, 0, 0, 0, 0, 0];  // Different angles for each shell
let animationFrameId;
let isArrowVisible = false;


const fillingOrder = [
    { shell: 0, subshell: 's', maxElectrons: 2 },
    { shell: 1, subshell: 's', maxElectrons: 2 },
    { shell: 1, subshell: 'p', maxElectrons: 6 },//10
    { shell: 2, subshell: 's', maxElectrons: 2 },
    { shell: 2, subshell: 'p', maxElectrons: 6 },
    { shell: 3, subshell: 's', maxElectrons: 2 },//20
    { shell: 2, subshell: 'd', maxElectrons: 10 },//30
    { shell: 3, subshell: 'p', maxElectrons: 6 },
    { shell: 4, subshell: 's', maxElectrons: 2 },
    { shell: 3, subshell: 'd', maxElectrons: 10 },//48
    { shell: 4, subshell: 'p', maxElectrons: 6 },
    { shell: 5, subshell: 's', maxElectrons: 2 },//56
    { shell: 3, subshell: 'd', maxElectrons: 14 },//70
    { shell: 4, subshell: 'p', maxElectrons: 10 },//80
    { shell: 5, subshell: 'p', maxElectrons: 6 },//86
    { shell: 6, subshell: 's', maxElectrons: 2 },//88
    { shell: 4, subshell: 'f', maxElectrons: 14 },//102
    { shell: 5, subshell: 'd', maxElectrons: 10 },//112
    { shell: 6, subshell: 'd', maxElectrons: 6 },//118

];

// Variable to store the currently active element
let currentActive = null;

//// DRAWING ATOM
function getOrbitRadius(shellIndex, filledShells) {
    const maxRadius = (atomCanvas.height / 2) - (2 * electronRadius); // Reserve space for electrons
    return (shellIndex + 1) * (maxRadius / filledShells);
}




function drawOrbit(orbitRadius) {
    atomCtx.beginPath();
    atomCtx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
    atomCtx.strokeStyle = "#DDDDDD"; // Gray orbit
    atomCtx.lineWidth = 1;
    atomCtx.stroke();
}

function drawElectron(orbitRadius, angleOffset, shellIndex) {
    let electronX = centerX + orbitRadius * Math.cos(angle[shellIndex] + angleOffset);
    let electronY = centerY + orbitRadius * Math.sin(angle[shellIndex] + angleOffset);
    
    atomCtx.beginPath();
    atomCtx.arc(electronX, electronY, electronRadius, 0, Math.PI * 2);
    atomCtx.fillStyle = "#68BBE3";
    atomCtx.fill();
}

function drawElectronsForShell(electronCount, orbitRadius, shellIndex) {
    const spacingAngle = 2 * Math.PI / electronCount;
    for(let i = 0; i < electronCount; i++) {
        drawElectron(orbitRadius, i * spacingAngle, shellIndex);
    }
}


function getElectronsPerShell(electronCount) {
    let electronsPerShell = [0, 0, 0, 0, 0, 0, 0];
    let remainingElectrons = electronCount;

    // Special cases for Chromium and Copper
    if (electronCount === 24) {
        return [2, 8, 13, 1];
    } else if (electronCount === 29) {
        return [2, 8, 18, 1];
    }
    else if (electronCount === 41) {
        return [2, 8, 18, 12, 1];
    }
    else if (electronCount === 42) {
        return [2, 8, 18, 13, 1];
    }
    else if (electronCount === 44) {
        return [2, 8, 18, 15, 1];
    }
    else if (electronCount === 45) {
        return [2, 8, 18, 16, 1];
    }
    else if (electronCount === 46) {
        return [2, 8, 18, 18];
    }
    else if (electronCount === 47) {
        return [2, 8, 18, 18, 1];
    }
    else if (electronCount === 57) {
        return [2, 8, 18, 18, 9, 2];
    }
    else if (electronCount === 58) {
        return [2, 8, 18, 19, 9, 2];
    }
    else if (electronCount === 64) {
        return [2, 8, 18, 25, 9, 2];
    }
    else if (electronCount === 78) {
        return [2, 8, 18, 32, 17, 1];
    }
    else if (electronCount === 79) {
        return [2, 8, 18, 32, 18, 1];
    }

    else if (electronCount === 89) {
        return [2, 8, 18, 32, 18, 9, 2];
    }
    else if (electronCount === 90) {
        return [2, 8, 18, 32, 18, 10, 2];
    }
    else if (electronCount === 91) {
        return [2, 8, 18, 32, 20, 9, 2];
    }
    else if (electronCount === 92) {
        return [2, 8, 18, 32, 21, 9, 2];
    }
    else if (electronCount === 93) {
        return [2, 8, 18, 32, 22, 9, 2];
    }
    else if (electronCount === 96) {
        return [2, 8, 18, 32, 25, 9, 2];
    }
    else if (electronCount === 103) {
        return [2, 8, 18, 32, 32, 8, 3];
    }
    
    


    for(let config of fillingOrder) {
        if(remainingElectrons <= 0) break;

        let electronsToFill = Math.min(remainingElectrons, config.maxElectrons);
        electronsPerShell[config.shell] += electronsToFill;
        remainingElectrons -= electronsToFill;
    }
    
    return electronsPerShell.filter(count => count > 0);
}

function drawAtom(electronCount) {
    atomCtx.clearRect(0, 0, atomCanvas.width, atomCanvas.height); 

    const electronsPerShell = getElectronsPerShell(electronCount);
    const filledShells = electronsPerShell.length;
    const nucleusRadius = 20 - 2*filledShells;

    // Draw the nucleus
    atomCtx.beginPath();
    atomCtx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2);
    atomCtx.fillStyle = "#DB1F48";
    atomCtx.fill();

    for (let i = 0; i < filledShells; i++) {
        drawOrbit(getOrbitRadius(i, filledShells));
        drawElectronsForShell(electronsPerShell[i], getOrbitRadius(i, filledShells), i);
        angle[i] += 0.03 - (0.03/filledShells * i); // reducing speed for outer shells
    }

    animationFrameId = requestAnimationFrame(() => drawAtom(electronCount));
    
}


function resetAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    // Optionally: Reset angle values to default if desired
    //angle = [0, 0, 0, 0, 0, 0, 0]; // Adjust based on your maximum number of shells
}

/**
 * Attach click event listeners to elements
 */
allChildren.forEach((child, index) => {
    if (child.classList.contains("element")) {
        child.addEventListener('click', function(event) {
            event.stopPropagation();
            event.preventDefault();  // Prevent the default behavior
            setActiveElement(this, index);
        });
    }
});



/**
 * Set the active element, update its visuals, and the side panel.
 * @param {Element} element - The clicked/selected element.
 * @param {Number} index - Index of the clicked/selected element in allChildren.
 */
function setActiveElement(element, index) {

    // Deselect current active element, if any
    if (currentActive) {
        currentActive.classList.remove('active');
        currentActive.style.opacity = "1";
    }

    // If clicked element is already active, deselect it
    if (element === currentActive) {
        currentActive = null;
        selectedElementDisplay.textContent = "None";
        wikiLink.href = "#";
        wikiLink.style.visibility = "hidden";
        dash.style.visibility = 'hidden';
        arrow[0].style.visibility = "hidden";
        isArrowVisible = false;
        resetLegend();
    } else { // Else, make the clicked element the active element
        element.classList.add('active');
        const elementName = element.getAttribute("data-element");
        const constructedLink = `https://en.wikipedia.org/wiki/${elementName}`;
        wikiLink.href = constructedLink;
        selectedElementDisplay.textContent = elementName;
        dash.style.visibility = 'visible';
        wikiLink.style.visibility = "visible";
        currentActive = element;
        
        if(window.scrollY <= 75)
        {
            arrow[0].style.visibility = "visible";
            isArrowVisible = true;
        }
        else 
        {
            arrow[0].style.visibility = "hidden";
            isArrowVisible = false;
        }

        highlightLegend(element)
    }

    updateTextBox(element);
    // Update opacity of other elements based on active state
    updateOpacity();

}

/**
 * Adjust the opacity of all elements based on which one is currently active.
 */
function updateOpacity() {
    allChildren.forEach(el => {
        if (el.classList.contains("element")) {
            el.style.opacity = (el === currentActive || !currentActive) ? "1" : "0.5";
        }
    });
}

/**
 * Handle arrow key navigation among elements.
 */
document.addEventListener('keydown', function(e) {
    if (!currentActive) return;

    let currentIndex = allChildren.indexOf(currentActive);
    let nextIndex = -1;


    switch (e.key) {
        
        case 'ArrowLeft':
        case 'a':
            nextIndex = navigateHorizontal(currentIndex, -1);
            e.preventDefault();
            break;
        case 'ArrowRight':
        case 'd':
            nextIndex = navigateHorizontal(currentIndex, 1);
            e.preventDefault();
            break;
        case 'ArrowUp':
        case 'w':
            nextIndex = navigateVertical(currentIndex, -18);
            e.preventDefault();
            break;
        case 'ArrowDown':
        case 's':
            nextIndex = navigateVertical(currentIndex, 18);
            e.preventDefault();
            break;
            
    }

    if (nextIndex !== -1) {
        setActiveElement(allChildren[nextIndex], nextIndex);
    }
});

/**
 * Navigate horizontally, skipping spacers.
 * @param {Number} index - Current index.
 * @param {Number} direction - Direction to navigate (1 for right, -1 for left).
 * @return {Number} - New index or -1 if out of bounds.
 */
function navigateHorizontal(index, direction) {
    let nextIndex = index + direction;
    while (nextIndex >= 0 && nextIndex < allChildren.length && allChildren[nextIndex].classList.contains('spacer')) {
        nextIndex += direction;
    }
    if((index==125 && direction>0))
    {
        nextIndex +=5;
    }
    if(index==131 && direction<0)
    {
        nextIndex-=2;
    }
    if (nextIndex>163)
    {
        nextIndex=-1;
    }
    return (nextIndex >= 0 && nextIndex < allChildren.length) ? nextIndex : -1;
}

/**
 * Navigate vertically, skipping spacers.
 * @param {Number} index - Current index.
 * @param {Number} step - Steps to take (typically 18 or -18).
 * @return {Number} - New index or -1 if out of bounds.
 */
function navigateVertical(index, step) {
    if(index==144 || index==145)
    {
        step -=2;
    }
    let nextIndex = index + step;
    while (nextIndex >= 0 && nextIndex < allChildren.length && allChildren[nextIndex].classList.contains('spacer')) {
        nextIndex += step;

        
    }
    if (nextIndex==127 || nextIndex==126 || nextIndex==164)
    {
        return -1;
    }
    else if (index <=125 && nextIndex >=131 && nextIndex<=143)
    {
        nextIndex+=2;
    }
    else if (nextIndex == 165|| nextIndex == 166)
    {
        nextIndex -= 34;
    }
    else if (index > 128 && nextIndex <= 128)
    {
        
        nextIndex-=2;
    }
    if(index==144 || index==145)
    {
        nextIndex +=2;
    }
    
    return (nextIndex >= 0 && nextIndex < allChildren.length) ? nextIndex : -1;
}

/**
 * Clear the active element when clicking outside of any element.
 */
document.addEventListener('click', function(e) {
    if (!e.target.closest('.element')) {
        clearActiveElement(e);
    }
    if(e.target.className == "arrow bounce")
    {
        window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
        arrow[0].style.visibility = 'hidden';
    }
});

/**
 * Clear the currently active element's styles.
 */
function clearActiveElement(e) {
    if (currentActive && !(e.target == wikiLink) && !(e.target==arrow[0])) {
        currentActive.classList.remove('active');
        currentActive.style.opacity = "1";
        selectedElementDisplay.textContent = "None";
        wikiLink.style.visibility = "hidden";
        dash.style.visibility = 'hidden';
        currentActive = null;
        updateOpacity();
        arrow[0].style.visibility = "hidden";
        isArrowVisible = false;



        const allLegendItems = document.querySelectorAll('.legend-item');
        const allLegendTexts = document.querySelectorAll('.legend-text'); // Get all legend texts

        allLegendItems.forEach(item => {
            item.classList.remove('active-legend');
            item.classList.remove('faded-legend');
    });
    allLegendTexts.forEach(span => {
        span.classList.remove("unselected-legend-text")
    })
    }
    
   
}

window.addEventListener('scroll', handleScroll);

function handleScroll() {
    if (isArrowVisible && window.scrollY > 200) {
        arrow[0].style.visibility = 'hidden';
        isArrowVisible = false;
    } else if (!isArrowVisible && window.scrollY <= 75 && currentActive) {
        arrow[0].style.visibility = 'visible';
        isArrowVisible = true;
    }
}

function highlightLegend(element) {
    // Deduce the category from the selected element's classList
    let category = null;

    if (element.classList.contains('alkali-metal')) {
    category = 'alkali-metal';
} else if (element.classList.contains('alkaline-earth')) {
    category = 'alkaline-earth';
} else if (element.classList.contains('transition-metal')) {
    category = 'transition-metal';
} else if (element.classList.contains('other-metal')) {
    category = 'other-metal';
} else if (element.classList.contains('metalloid')) {
    category = 'metalloid';
} else if (element.classList.contains('nonmetal')) {
    category = 'nonmetal';
} else if (element.classList.contains('noble-gas')) {
    category = 'noble-gas';
} else if (element.classList.contains('lanthanide')) {
    category = 'lanthanide';
} else if (element.classList.contains('actinide')) {
    category = 'actinide';
}
    const allLegendItems = document.querySelectorAll('.legend-item');
    const allLegendTexts = document.querySelectorAll('.legend-text'); // Get all legend texts



    if (category) {
        allLegendItems.forEach(item => {
            // If this is the legend item corresponding to the selected element's category
            if (item.classList.contains(category)) {
                item.classList.add('active-legend');
                item.classList.remove('faded-legend');
            } else {
                item.classList.remove('active-legend');
                item.classList.add('faded-legend');

            }
        });
        allLegendTexts.forEach(span =>
            {
                if(span.classList.contains(category))
                {
                    span.classList.remove("unselected-legend-text")
                }
                else
                {
                    span.classList.add("unselected-legend-text")

                }
            })

    } else {
        // If no category match found, reset all legend items
        allLegendItems.forEach(item => {
            item.classList.remove('active-legend');
            item.classList.remove('faded-legend');
        });
        allLegendTexts.forEach(span => {
            span.classList.remove("unselected-legend-text")
        })
    }
}




function resetLegend() {
    const allLegendItems = document.querySelectorAll('.legend-item');
    const allLegendTexts = document.querySelectorAll('.legend-text'); // Get all legend texts

    allLegendItems.forEach(item => {
        item.classList.remove('active-legend');
        item.classList.remove('faded-legend');
    });
    allLegendTexts.forEach(span => {
        span.classList.remove("unselected-legend-text")
    })
}

function updateTextBox(element)
{
    textboxName.textContent = element.getAttribute("data-element");
    getElementInfo(element);
    getElementAtom(element);
}

function getElementInfo(element)
{
    let elementName = element.getAttribute("data-element").toLowerCase();

    fetch('elementsInfo.json')
    .then(response => response.json())
        .then(data => {
            const info = data[elementName];
            if (info) {
                console.log(textboxText.innerHTML);
                textboxText.innerHTML= info.text;
                textboxHolder.style.visibility = 'visible';
                textboxSub.style.visibility = 'visible';
                textboxCenter.style.visibility = 'visible';
                return info  
            }
        })
        .catch(error => {
            console.error('Error fetching the JSON data: ', error);
        });

}

function getElementAtom(element, atomCanvas)
{
    let elementName = element.getAttribute("data-element").toLowerCase();

    fetch('elementsInfo.json')
    .then(response => response.json())
        .then(data => {
            const info = data[elementName];
            if (info) {
                resetAnimation();
                drawAtom(info.atomic_number);
                textboxAtom.style.visibility = 'visible';
                return info  
            }
        })
        .catch(error => {
            console.error('Error fetching the JSON data: ', error);
        });
}


