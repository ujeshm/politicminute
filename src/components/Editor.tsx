'use client'

import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface EditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export default function Editor({ value, onChange, placeholder }: EditorProps) {
    return (
        <div className="bg-white dark:bg-gray-900">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="h-64 mb-12" // mb-12 to account for toolbar and bottom spacing
                modules={{
                    toolbar: [
                        [{ 'header': [1, 2, false] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link'],
                        ['clean']
                    ],
                }}
            />
        </div>
    )
}
