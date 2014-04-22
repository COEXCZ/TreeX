if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.undo = {
    init: function ()
    {
        this.buttonAdd('undo', 'Undo', this.undoButton);
        this.buttonAdd('redo', 'Redo', this.redoButton);
    },

    undoButton: function(buttonName, buttonDOM, buttonObj, e)
    {
        this.execCommand('undo')
    },

    redoButton: function(buttonName, buttonDOM, buttonObj, e)
    {
        this.execCommand('redo')
    }
};