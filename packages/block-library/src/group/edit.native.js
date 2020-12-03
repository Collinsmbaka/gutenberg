/**
 * External dependencies
 */
import { View, Dimensions } from 'react-native';

/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';
import {
	compose,
	withPreferredColorScheme,
	useResizeObserver,
} from '@wordpress/compose';
import { InnerBlocks } from '@wordpress/block-editor';
import { useCallback } from '@wordpress/element';
import { WIDE_ALIGNMENTS } from '@wordpress/components';

/**
 * Internal dependencies
 */
import styles from './editor.scss';

function GroupEdit( {
	attributes,
	hasInnerBlocks,
	isSelected,
	isLastInnerBlockSelected,
	getStylesFromColorScheme,
	parentBlockAlignment,
	mergedStyle,
} ) {
	const { align } = attributes;
	const [ resizeObserver, sizes ] = useResizeObserver();
	const { width } = sizes || { width: 0 };
	const { alignments } = WIDE_ALIGNMENTS;
	const screenWidth = Math.floor( Dimensions.get( 'window' ).width );
	const isFullWidth = align === alignments.full;
	const isParentFullWidth = parentBlockAlignment === alignments.full;
	const isEqualWidth = width === screenWidth;

	const renderAppender = useCallback(
		() => (
			<View
				style={ [
					( isEqualWidth || isFullWidth || isParentFullWidth ) &&
						( hasInnerBlocks
							? styles.groupAppender
							: styles.wideGroupAppender ),
				] }
			>
				<InnerBlocks.ButtonBlockAppender />
			</View>
		),
		[ align, hasInnerBlocks, width ]
	);

	if ( ! isSelected && ! hasInnerBlocks ) {
		return (
			<View
				style={ [
					getStylesFromColorScheme(
						styles.groupPlaceholder,
						styles.groupPlaceholderDark
					),
					! hasInnerBlocks && {
						...styles.marginVerticalDense,
						...styles.marginHorizontalNone,
					},
				] }
			/>
		);
	}

	return (
		<View
			style={ [
				isSelected && hasInnerBlocks && styles.innerBlocks,
				mergedStyle,
				isSelected &&
					hasInnerBlocks &&
					mergedStyle?.backgroundColor &&
					styles.hasBackgroundAppender,
				isLastInnerBlockSelected &&
					mergedStyle?.backgroundColor &&
					styles.isLastInnerBlockSelected,
			] }
		>
			{ resizeObserver }
			<InnerBlocks renderAppender={ isSelected && renderAppender } />
		</View>
	);
}

export default compose( [
	withSelect( ( select, { clientId } ) => {
		const {
			getBlock,
			getBlockIndex,
			hasSelectedInnerBlock,
			getBlockRootClientId,
			getSelectedBlockClientId,
			getBlockAttributes,
		} = select( 'core/block-editor' );

		const block = getBlock( clientId );
		const hasInnerBlocks = !! ( block && block.innerBlocks.length );
		const isInnerBlockSelected =
			hasInnerBlocks && hasSelectedInnerBlock( clientId, true );
		let isLastInnerBlockSelected = false;

		if ( isInnerBlockSelected ) {
			const { innerBlocks } = block;
			const selectedBlockClientId = getSelectedBlockClientId();
			const totalInnerBlocks = innerBlocks.length - 1;
			const blockIndex = getBlockIndex( selectedBlockClientId, clientId );
			isLastInnerBlockSelected = totalInnerBlocks === blockIndex;
		}

		const parentId = getBlockRootClientId( clientId );
		const parentBlockAlignment = getBlockAttributes( parentId )?.align;

		return {
			hasInnerBlocks,
			isLastInnerBlockSelected,
			parentBlockAlignment,
		};
	} ),
	withPreferredColorScheme,
] )( GroupEdit );
