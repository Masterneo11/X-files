import React from 'react';

interface InterfaceName {
    Name: string;
    className?: string;
    value: string | undefined | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
}

const NameField: React.FC<InterfaceName> = ({ Name, className, onChange, value, placeholder }) => {
    return (
        <>
            <div className='NameField'>
                <label htmlFor='Name' className="block text-sm font-medium text-gray-700">{Name}</label>
                <input
                    id='Name'
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            </div>
        </>
    );
}

export default NameField;
