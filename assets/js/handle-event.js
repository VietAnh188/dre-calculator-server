import {phaseNumberInput, phaseTable, resultByPhaseTable, resultTotalTable} from './constants.js'
import {refreshPhaseNumberTable} from "./index.js";

let phaseNumber = 0

const handleRenderPhaseNumber = (phaseNumber) => {
    for (let i = 0; i < phaseNumber; i++) {
        const row = document.createElement('tr')
        row.setAttribute('class', 'phase-number-row')
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('td')
            cell.setAttribute('class', 'phase-number-cell')
            const input = document.createElement('input')
            input.style.width = '90%'
            if (j !== 0) {
                if (j === 1) {
                    input.setAttribute('type', 'number')
                    input.setAttribute('class', 'phase-defect')
                }
                if (j === 2) {
                    input.setAttribute('type', 'number')
                    input.setAttribute('class', 'number-defect-total')
                }
            } else {
                input.setAttribute('type', 'text')
                input.setAttribute('class', 'phase-name')
            }
            cell.appendChild(input)
            row.appendChild(cell)
        }
        phaseTable.appendChild(row)
    }
}

const handleRemoveRow = (table, rowNumber, phaseTableRows) => {
    for (let i = 0; i < rowNumber; i++) {
        table.removeChild(phaseTableRows[i])
    }
}

export const handleNewPhase = (event) => {
    event.preventDefault()
    const phaseTableRows = document.querySelectorAll('#middle table .phase-number-row')
    if (phaseNumber === 0) {
        handleRemoveRow(phaseTable, phaseTableRows.length, phaseTableRows)
    }
    if (phaseNumber < phaseTableRows.length) {
        handleRemoveRow(phaseTable, phaseTableRows.length - phaseNumber, phaseTableRows)
    }
    if (phaseNumber > phaseTableRows.length) {
        handleRenderPhaseNumber(phaseNumber - phaseTableRows.length)
    }
    refreshPhaseNumberTable()
}

export const handleChangePhaseNumber = (event) => {
    if (event.target.value < 0) {
        alert("Phase number is not small than 0")
        event.target.value = 0
    }
    phaseNumber = Number(phaseNumberInput.value)
}

export const handleClearPhase = (event) => {
    event.preventDefault()
    phaseNumberInput.value = 0
    const phaseTableRows = document.querySelectorAll('#middle table .phase-number-row')
    phaseNumber = Number(phaseNumberInput.value)
    handleRemoveRow(phaseTable, phaseTableRows.length, phaseTableRows)
}

const handleDREFormula = (defect, total) => {
    return (defect / total) * 100
}

const handleDRECalculate = (defect, total) => {
    let dre = 0
    let defectAfterCalculate = 0
    let defectTotalAfterCalculate = 0
    if (defect.length === total.length) {
        if (defect.length > 1 && total.length > 1) {
            const loopTimes = defect.length
            for (let i = 0; i < loopTimes; i++) {
                if (defect[i].value === '' || total[i].value === '') continue
                defectAfterCalculate += Number(defect[i].value)
                defectTotalAfterCalculate += Number(total[i].value)
            }
            dre = handleDREFormula(defectAfterCalculate, defectTotalAfterCalculate)
        }
    }
    return {
        dre: dre,
        defectAfterCalculate: defectAfterCalculate,
        defectTotalAfterCalculate: defectTotalAfterCalculate
    }
}

const handleRenderDRE = (data, table) => {
    const row = document.createElement('tr')
    row.setAttribute('class', 'dre-total-row')
    for (let i = 0; i < 3; i++) {
        const cell = document.createElement('td')
        cell.setAttribute('class', 'dre-total-cell')
        cell.style.textAlign = 'center'
        cell.style.padding = '10px'
        switch (i) {
            case 0:
                cell.innerText = data.defectAfterCalculate
                break
            case 1:
                cell.innerText = data.defectTotalAfterCalculate
                break
            case 2:
                cell.innerText = `${data.dre.toFixed(2)} Percent`
                break
            default:
                break
        }
        row.appendChild(cell)
    }
    table.appendChild(row)
}

const handleRenderDREByPhase = (data, table) => {
    data.forEach(phase => {
        const row = document.createElement('tr')
        row.setAttribute('class', 'dre-by-phase-row')
        if (phase[0] === '' || phase[1] === '' || phase[2] === '') {
            return;
        }
        for (let i = 0; i < phase.length + 1; i++) {
            const cell = document.createElement('td')
            cell.setAttribute('class', 'dre-by-phase-cell')
            cell.style.textAlign = 'center'
            cell.style.padding = '10px'
            switch (i) {
                case 3:
                    cell.innerText = `${handleDREFormula(Number(phase[1]), Number(phase[2])).toFixed(2)} Percent`
                    break
                default:
                    cell.innerText = phase[i]
                    break
            }
            row.appendChild(cell)
        }
        table.appendChild(row)
    })
}

const handleMappingData = (data) => {
    return [...data].map(row => [...row.cells].map(cell => cell.children[0].value))
}

const recursiveChildren = (htmlCollection) => {
    for (let i = 0; i < htmlCollection.children.length; i++) {
        if (htmlCollection.children[i].nodeName === "INPUT") {
            if (htmlCollection.children[i].value === '') {
                htmlCollection.children[i].classList.add('empty')
            } else {
                if (htmlCollection.children[i].classList.contains('empty')) {
                    htmlCollection.children[i].classList.remove('empty')
                }
            }
        } else {
            recursiveChildren(htmlCollection.children[i])
        }
    }
}

const handleCheckEmptyColumn = (rows) => {
    for (let i = 0; i < rows.length; i++) {
        recursiveChildren(rows[i])
    }
}

const checkAllColumnIsEmpty = (rows) => {
    let hasEmpty = false
    rows.forEach(row => {
        [...row.children].forEach(column => {
            if (column.children[0].value === '') {
                hasEmpty = true
            }
        })
    })
    return hasEmpty
}

export const handleStartCalculate = (event) => {
    event.preventDefault()
    const phaseTableRows = document.querySelectorAll('#middle table .phase-number-row')
    const hasEmpty = checkAllColumnIsEmpty(phaseTableRows)
    handleCheckEmptyColumn(phaseTableRows)
    console.log(hasEmpty)
    if (!hasEmpty) {
        if (phaseTableRows.length !== 0) {
            const phaseDefects = document.querySelectorAll('#middle table .phase-defect')
            const phaseDefectTotal = document.querySelectorAll('#middle table .number-defect-total')
            const dre = handleDRECalculate(phaseDefects, phaseDefectTotal)
            const resultTotalRows = document.querySelectorAll('#bottom .result .result-total .dre-total-row')
            const resultByPhaseRows = document.querySelectorAll('#bottom .result .result-by-phase .dre-by-phase-row')
            const phaseNumberRow = document.querySelectorAll('#middle table .phase-number-row')
            const dres = handleMappingData(phaseNumberRow)
            handleRenderDREByPhase(dres, resultByPhaseTable)
            if (resultTotalRows.length !== 0) {
                handleRemoveRow(resultByPhaseTable, resultByPhaseRows.length, resultByPhaseRows)
                handleRemoveRow(resultTotalTable, 1, resultTotalRows)
            }
            handleRenderDRE(dre, resultTotalTable)
        } else {
            alert('Your project has no phases')
        }
    } else {
        alert("Some columns are still empty")
    }
}

export const handleClearResult = (event) => {
    event.preventDefault()
    const resultTotalRows = document.querySelectorAll('#bottom .result .dre-total-row')
    const resultByPhaseRows = document.querySelectorAll('#bottom .result .dre-by-phase-row')
    handleRemoveRow(resultTotalTable, resultTotalRows.length, resultTotalRows)
    handleRemoveRow(resultByPhaseTable, resultByPhaseRows.length, resultByPhaseRows)
}

export const handleInputTotalChange = (currColumn, prevColumn) => {
    if (prevColumn.value === '') {
        alert("Defect Corrected being Empty")
        prevColumn.focus()
    }
    if (Number(currColumn.value) < Number(prevColumn.value)) {
        alert("Total Defects must be greater than Defect Corrected")
        currColumn.value = ''
        currColumn.focus()
    }
}

export const handleInputCorrectedChange = (currColumn, prevColumn, nextColumn) => {
    if (prevColumn.value === '') {
        alert("Your Phase name being Empty")
        prevColumn.focus()
    }
    if (currColumn.value !== '' && nextColumn.value !== '') {
        if (Number(currColumn.value) > Number(nextColumn.value)) {
            alert("Defect Corrected must be smaller than Total Defects")
            currColumn.value = ''
            currColumn.focus()
        }
    }
}