import { useState, useRef, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import dropdown from '@/assets/icons/dropdown.svg';

type DropdownType = 'search' | 'checkbox' | 'calendar';

interface Props {
    icon: StaticImageData;
    text: string;
    action: (value: any) => void;
    type: DropdownType;
    options?: string[]; // Only if type === 'checkbox'
}

export const FilterBtn = ({icon, text, action, type, options} : Props) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [checkboxValues, setCheckboxValues] = useState<string[]>([]);
    const btnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !btnRef.current?.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Debounce for search input
    useEffect(() => {
        if (type === 'search') {
            const timeout = setTimeout(() => {
                action(inputValue);
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [inputValue, action, type]);

    // Handle checkbox change
    const toggleCheckbox = (value: string) => {
        let newValues: string[];
        if (checkboxValues.includes(value)) {
            newValues = checkboxValues.filter(v => v !== value);
        } else {
            newValues = [...checkboxValues, value];
        }
        setCheckboxValues(newValues);
        action(newValues); // call immediately
    };

    // Handle calendar change
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        action(date); // call immediately
    };

    const renderDropdownContent = () => {
        switch (type) {
            case 'search':
                return (
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                );
            case 'checkbox':
                return (
                    <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                        {options?.map((option) => (
                            <label key={option} className="text-sm text-gray-700 flex items-center gap-2">
                                <input type="checkbox" className="form-checkbox" />
                                {option}
                            </label>
                        )) ?? <p className="text-gray-500 text-sm">Sin opciones</p>}
                    </div>
                );
            case 'calendar':
                return (
                    <input
                        type="date"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                );
            default:
                return null;
        }
    };


    return (
        <div className='relative inline-block'>
            <button
                ref={btnRef}
                onClick={() => {setOpen(!open)}}
                className="pl-2 pr-2 pt-1.5 pb-1.5 inline-flex h-8 gap-[8px] items-center justify-center relative rounded-[36px] overflow-hidden border border-solid border-[#00000080] cursor-pointer"
            >
                <Image 
                    src={icon}
                    alt={`${text} icon`}
                    className="!relative !w-6 !h-6 !mt-[-2.00px] !mb-[-2.00px]"
                />
                <div className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Regular',Helvetica] font-normal text-black text-sm text-center tracking-[0.10px] leading-5 whitespace-nowrap">
                    {text}
                </div>
                <Image
                    src={dropdown}
                    alt="dropdown icon"
                    width={18}
                    height={18}
                    className={`object-contain transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            <div
                ref={menuRef}
                className={`absolute z-50 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg p-4 transition-all duration-150 ease-in-out origin-top transform ${
                    open
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
            >
                {renderDropdownContent()}
            </div>
        </div>
    )
}