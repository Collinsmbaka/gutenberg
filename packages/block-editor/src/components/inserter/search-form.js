/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { VisuallyHidden, Button } from '@wordpress/components';
import { Icon, search, closeSmall } from '@wordpress/icons';
import { memo, useEffect, useRef, useCallback } from '@wordpress/element';
/**
 * Internal dependencies
 */
import { useSearchQuery } from './store';

function InserterSearchForm( { className, placeholder } ) {
	const instanceId = useInstanceId( InserterSearchForm );
	const searchInput = useRef();
	const [ value, setValue ] = useSearchQuery();

	const handleOnChange = useCallback(
		( event ) => {
			setValue( event.target.value );
		},
		[ setValue ]
	);

	const handleOnClear = useCallback( () => {
		setValue( '' );
		searchInput.current.focus();
	}, [ setValue ] );

	useEffect( () => {
		return () => {
			setValue( '' );
		};
	}, [] );

	// Disable reason (no-autofocus): The inserter menu is a modal display, not one which
	// is always visible, and one which already incurs this behavior of autoFocus via
	// Popover's focusOnMount.
	/* eslint-disable jsx-a11y/no-autofocus */
	return (
		<div
			className={ classnames(
				'block-editor-inserter__search',
				className
			) }
		>
			<VisuallyHidden
				as="label"
				htmlFor={ `block-editor-inserter__search-${ instanceId }` }
			>
				{ placeholder }
			</VisuallyHidden>
			<input
				ref={ searchInput }
				className="block-editor-inserter__search-input"
				id={ `block-editor-inserter__search-${ instanceId }` }
				type="search"
				placeholder={ placeholder }
				autoFocus
				onChange={ handleOnChange }
				autoComplete="off"
				value={ value || '' }
			/>
			<div className="block-editor-inserter__search-icon">
				{ !! value && (
					<Button
						icon={ closeSmall }
						label={ __( 'Reset search' ) }
						onClick={ handleOnClear }
					/>
				) }
				{ ! value && <Icon icon={ search } /> }
			</div>
		</div>
	);
	/* eslint-enable jsx-a11y/no-autofocus */
}

const memoizedInserterSearchForm = memo( InserterSearchForm );

export default memoizedInserterSearchForm;
