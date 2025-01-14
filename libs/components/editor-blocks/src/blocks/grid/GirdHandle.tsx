import type { FC } from 'react';
import { useState } from 'react';
import { styled } from '@toeverything/components/ui';
import { BlockEditor } from '@toeverything/framework/virgo';

const GRID_ADD_HANDLE_NAME = 'grid-add-handle';

type GridHandleProps = {
    editor: BlockEditor;
    onDrag?: (e: MouseEvent) => void;
    onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
    blockId: string;
    enabledAddItem: boolean;
    draggable: boolean;
};

export const GridHandle: FC<GridHandleProps> = function ({
    blockId,
    editor,
    enabledAddItem,
    onDrag,
    onMouseDown,
    draggable,
}) {
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
    const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = e => {
        if (draggable) {
            const cb = (e: MouseEvent) => {
                onDrag && onDrag(e);
            };
            onMouseDown && onMouseDown(e);
            setIsMouseDown(true);
            editor.mouseManager.onMouseMove(cb);
            editor.mouseManager.onMouseupEventOnce(() => {
                setIsMouseDown(false);
                editor.mouseManager.offMouseMove(cb);
            });
        }
    };
    const handleCreateGridItem = async () => {
        const [, textBlock] =
            await editor.commands.blockCommands.createGridItem(blockId);
        if (textBlock) {
            editor.selectionManager.setActivatedNodeId(textBlock.id);
        }
    };
    return (
        <GridHandleContainer
            style={
                isMouseDown
                    ? {
                          backgroundColor: '#3E6FDB',
                      }
                    : {}
            }
            onMouseDown={handleMouseDown}
        >
            {enabledAddItem ? (
                <AddGridHandle
                    onClick={handleCreateGridItem}
                    className={GRID_ADD_HANDLE_NAME}
                >
                    +
                </AddGridHandle>
            ) : null}
        </GridHandleContainer>
    );
};

const GridHandleContainer = styled('div')(({ theme }) => ({
    position: 'relative',
    width: '10px',
    flexGrow: '0',
    flexShrink: '0',
    padding: '5px 4.5px',
    minHeight: '15px',
    cursor: 'col-resize',
    borderRadius: '1px',
    backgroundClip: 'content-box',
    ' &:hover': {
        backgroundColor: theme.affine.palette.primary,
        [`.${GRID_ADD_HANDLE_NAME}`]: {
            display: 'block',
        },
    },
}));

const AddGridHandle = styled('div')(({ theme }) => ({
    display: 'none',
    position: 'absolute',
    transition: 'all 0.2s ease-in-out',
    height: '20px',
    lineHeight: '18px',
    width: '10px',
    borderRadius: '6px',
    top: 'calc(50% - 10px)',
    left: '0px',
    cursor: 'pointer',
    color: theme.affine.palette.primary,
    overflow: 'hidden',
    textAlign: 'center',
    backgroundColor: theme.affine.palette.white,
    '&:hover': {
        fontWeight: 'bold',
    },
}));
