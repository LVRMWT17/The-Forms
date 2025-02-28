import './align.css';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const MarkdownForm = ({ formDescription, onDescriptionChange }) => {
    const [description, setDescription] = useState(formDescription);
    const editorRef = useRef(null);
    const { t, i18n } = useTranslation();
    useEffect(() => {
        setDescription(description);
    }, [description]);

    const handleChange = () => {
        const description = editorRef.current.innerHTML;
        console.log(description)
            setDescription(description);
            onDescriptionChange(description);
    };

    const toggleAlignment = (alignmentClass) => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        if (selectedText === '') return;

        const newNode = document.createElement('div');
        newNode.className = alignmentClass;
        newNode.textContent = selectedText;

        range.deleteContents();
        range.insertNode(newNode);

        handleChange();

        const newRange = document.createRange();
        newRange.setStartAfter(newNode);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
    };

    const toggleFormatting = (tag) => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
  
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
  
        if (selectedText) {
          const parentNode = range.startContainer.parentElement;
          const currentTag = parentNode.tagName.toLowerCase();

            if (currentTag === tag) {
              const textNode = document.createTextNode(selectedText);
              const parent = parentNode.parentNode;
              parent.removeChild(parentNode);
              range.insertNode(textNode);
              const newRange = document.createRange();
              newRange.setStartAfter(textNode);
              newRange.collapse(true);
              selection.removeAllRanges();
              selection.addRange(newRange);
            } else {

                const newNode = document.createElement(tag);
                newNode.textContent = selectedText;
                range.deleteContents();
                range.insertNode(newNode);
              const newRange = document.createRange();
              newRange.setStartAfter(newNode);
              newRange.collapse(true);
            selection.removeAllRanges();
              selection.addRange(newRange);
          }

          setDescription(editorRef.current.innerHTML);
        }
    };
    const toggleList = (isNumbered) => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
    
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
    
        if (selectedText === '') return;
    
        const parentListItem = range.startContainer.parentElement.closest('li');
    
        if (parentListItem) {

            const listItemText = parentListItem.textContent;
            const newNode = document.createElement('div');
            newNode.textContent = listItemText;

            const listItemRange = document.createRange();
            listItemRange.selectNode(parentListItem);
            listItemRange.deleteContents();
            listItemRange.insertNode(newNode);
        } else {
            const newListItem = document.createElement('li');
            newListItem.textContent = selectedText;

            let list;
            if (isNumbered) {
                list = document.createElement('ol');
            } else {
                list = document.createElement('ul');
            }
            if (range.startContainer.parentElement.tagName === (isNumbered ? 'OL' : 'UL')) {
                list = range.startContainer.parentElement;
            } else {
                range.deleteContents();
                range.insertNode(list);
            }

            list.appendChild(newListItem);
            const newRange = document.createRange();
            newRange.setStartAfter(newListItem);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
            handleChange();
        }
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const currentText = editorRef.current.innerText;
            const lastLine = currentText.split('\n').pop();

            if (lastLine.startsWith('- ') || lastLine.startsWith('1. ')) {
                const newLine = lastLine.startsWith('- ') ? '- ' : '1. ';
                document.execCommand('insertText', false, '\n' + newLine);
            } else {
                document.execCommand('insertText', false, '\n');
            }
        }
    };

    return (
        <div className="container mt-5">
        <div className="form-group">
                <label>{t("Описание:")}</label>
                <div className="mb-2">
                    <button type="button" className="btn btn-outline-secondary me-2" onClick={() => toggleFormatting('strong')}>b</button>
                    <button type="button" className="btn btn-outline-secondary me-2" onClick={() => toggleFormatting('em')}>i</button>
                    <button type="button" className="btn btn-outline-secondary me-2" onClick={() => toggleFormatting('h1')}>h1</button>
                    <button type="button" className="btn btn-outline-secondary me-2" onClick={() => toggleFormatting('h2')}>h2</button>
                    <button type="button" className="btn btn-outline-secondary me-2" onClick={() => toggleFormatting('h3')}>h3</button>
                    <button type="button" className="btn btn-outline-secondary me-2" onClick={() => toggleList(false)}>ul</button>
                    <button type="button" className="btn btn-outline-secondary me-2" onClick={() => toggleList(true)}>ol</button>
                    <button type="button" className="btn btn-outline-secondary me-2" onClick={() => toggleAlignment('left')}>L</button>
                    <button type="button" className="btn btn-outline-secondary me-2" onClick={() => toggleAlignment('center')}>C</button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => toggleAlignment('right')}>R</button>
                </div>
                <div
                    contentEditable
                    onChange={handleChange}
                    ref={editorRef}
                    value={description}
                    onKeyDown={handleKeyDown}
                    onInput={handleChange}
                    style={{ border: '1px solid #ccc', padding: '10px', minHeight: '200px' }}
                />
        </div>
            </div>
    )
};
export default MarkdownForm;