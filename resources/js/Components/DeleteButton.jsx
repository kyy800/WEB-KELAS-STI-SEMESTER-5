import Button from '@/Components/Button';
import Icon from '@/Components/Icon';
import { router } from '@inertiajs/react';

export default function DeleteButton({
    href,
    message = 'Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
    label = 'Hapus',
    variant = 'ghost',
    size = 'sm',
    iconOnly = false,
    className = '',
}) {
    const handleClick = () => {
        if (window.confirm(message)) {
            router.delete(href, { preserveScroll: true });
        }
    };

    return (
        <Button
            type="button"
            variant={variant}
            size={size}
            onClick={handleClick}
            className={className}
            title={label}
        >
            <Icon name="trash" className="h-4 w-4" />
            {!iconOnly && label}
        </Button>
    );
}
