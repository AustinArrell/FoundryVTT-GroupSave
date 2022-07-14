let d = new Dialog({
    title: "Group Save",
    content: "<p>Select a save type:</p>",
    buttons: {
        one: {
            label: "Reflex",
            callback: () => roll_dice("REFLEX")
        },
        two: {
            label: "Fortitude",
            callback: () => roll_dice("FORTITUDE")
        },
        three: {
            label: "Will",
            callback: () => roll_dice("WILL")
           }
    },
    render: html => console.log("Register interactivity in the rendered dialog"),
    close: html => console.log("Dialog Closed")
   });
d.render(true);


/*********************************************************************/
function roll_dice(saveType)
{
    let highlighted_tokens = canvas.tokens.controlled;
    let results_array = [];
    
    
    for (const token of highlighted_tokens)
    {    
        // Get actor info
        let name = token.name;
        let roll_mod = 0;
        
        // Set roll mod based on save type
        switch(saveType)
        {
            case 'REFLEX':
                roll_mod = token.actor.getRollData().attributes.savingThrows.ref.total;
                break;
            case "FORTITUDE":
                roll_mod = token.actor.getRollData().attributes.savingThrows.fort.total;
                break;
            case "WILL":
                roll_mod = token.actor.getRollData().attributes.savingThrows.will.total;
                break;
        }

        // Roll the dice
        let roll = new Roll("1d20+ @modifier",{modifier:roll_mod});
        roll.evaluate(async=false);
        let die_result = roll.terms.at(0).results.at(0).result;
        let roll_total = die_result + roll_mod;

        // Check for Nat 1 or Nat 20, set text color accordingly
        let color = "";
        if ( die_result == 20) { color = "green" }
        else if ( die_result == 1) { color = "red" }

        results_array.push("<br><p style='color:"+ color +";font-size:12px'><b>" + name + "</b>" + ": " + die_result + " +" + roll_mod + " = " + "<b>" + roll_total + "</b>")
    }

    // Output results to chat
        ChatMessage.create({
            content:results_array,
            blind:"true",  
            flavor:"<h2>Group " + saveType + " Save</h2>[NAME]: [ROLL]+[BONUS]=[TOTAL]"
        })
}
