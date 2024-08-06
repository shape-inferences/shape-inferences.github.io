var selectedExample = {'barense': 0, 'hvm': 0, 'shapenet': 0, 'shapegen': 0};
var visibleDataset = 'barense';
var showOOO = false;
var oddities = {};

function toggleDatasetView(dsetElement) {
    $('.tab-content').hide();
    $('li').removeClass('is-active');
    visibleDataset = $($(dsetElement).children()[0]).html().toLowerCase();
    $(`#${visibleDataset}`).show();
    $(`#link-${visibleDataset}`).addClass('is-active');
    exampleMemoryIdx = selectedExample[visibleDataset];
    exampleMemory = $(`#${visibleDataset} .ex-${exampleMemoryIdx}`);
    toggleDatasetExample(exampleMemory);
}

function toggleDatasetExample(repoElement) {
    repoElement = $(repoElement);
    $('.my-container').removeClass('is-active');
    repoElement.addClass('is-active');
    mainContainer = $('.dataset-main');
    mainContainer.empty();
    newChildren = repoElement.children().children();
    for (let i = 0; i < newChildren.length; i++) {
        let newElement = $('<span></span>');
        newElement.append($(newChildren[i]).clone());
        mainContainer.append(newElement);
    }
    classes = repoElement[0].classList;
    for (let i = 0; i < classes.length; i++) {
        if (classes[i].startsWith('ex-')) {
            exampleIdx = parseInt(classes[i][3]);
        }
    }
    datasetKey = repoElement.parent().parent().parent().attr('id');
    selectedExample[datasetKey] = exampleIdx;
    setOddityVisibility();
}

function populateOddities() {
    oddities = {};
    for (let key in selectedExample) {
        oddities[key] = [];
        numImages = $(`#${key} .ex-0`).children().children().length;
        for (let i = 0; i < 4; i++) {
            example = $(`#${key} .ex-${i}`);
            images = example.children().children();
            for (let k = 0; k < images.length; k++) {
                if ($(images[k]).attr('src').includes('oddity')) {
                    oddities[key].push(k);
                }
            }
        }
    }
    return oddities;
}

function setOddityVisibility() {
    oddity = oddities[visibleDataset][selectedExample[visibleDataset]];
    oddityElement = $(`#${visibleDataset} .dataset-main`).children()[oddity];
    if (showOOO) {
        $(oddityElement).addClass('oddity');
    } else {
        $(oddityElement).removeClass('oddity');
    }
}

$(document).ready(function() {
    $('#model-to-human').load('images/model_human.html');

    $('#dataset-container').load('plot.html #dataset-explorer', function() {
        $('.tab-content').hide();
        $('#barense').show();
        oddities = populateOddities();
        toggleDatasetExample($('#barense .start-ex'));
        $('#ooo-switch').prop('checked', false);
        $('#ooo-switch').click(function() {
            showOOO = $(this).is(':checked');
            setOddityVisibility();
        });
    });
});
